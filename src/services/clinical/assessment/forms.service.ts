import path from "path";
import { inject, injectable } from "tsyringe";
import { ApiError } from "../../../common/api.error";
import { Helper } from "../../../common/helper";
import { Logger } from "../../../common/logger";
import { TimeHelper } from "../../../common/time.helper";
import { IAssessmentHelperRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface";
import { IAssessmentRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface";
import { IAssessmentTemplateRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface";
import { IPatientRepo } from "../../../database/repository.interfaces/users/patient/patient.repo.interface";
import { IPersonRepo } from "../../../database/repository.interfaces/person/person.repo.interface";
import { IRoleRepo } from "../../../database/repository.interfaces/role/role.repo.interface";
import { IUserRepo } from "../../../database/repository.interfaces/users/user/user.repo.interface";
import { AssessmentDomainModel } from "../../../domain.types/clinical/assessment/assessment.domain.model";
import { AssessmentDto } from "../../../domain.types/clinical/assessment/assessment.dto";
import { AssessmentTemplateDto } from "../../../domain.types/clinical/assessment/assessment.template.dto";
import {
    AssessmentNodeType,
    BiometricQueryAnswer,
    BooleanQueryAnswer,
    CAssessmentListNode,
    CAssessmentMessageNode,
    CAssessmentQueryOption,
    CAssessmentQuestionNode,
    CAssessmentTemplate,
    DateQueryAnswer,
    FileQueryAnswer,
    FloatQueryAnswer,
    IntegerQueryAnswer,
    MessageAnswer,
    MultipleChoiceQueryAnswer,
    QueryResponseType,
    SingleChoiceQueryAnswer,
    TextQueryAnswer
} from "../../../domain.types/clinical/assessment/assessment.types";
import { FormDto } from "../../../domain.types/clinical/assessment/form.types";
import { FileResourceDto } from "../../../domain.types/general/file.resource/file.resource.dto";
import { ProgressStatus, uuid } from "../../../domain.types/miscellaneous/system.types";
import { DateStringFormat } from "../../../domain.types/miscellaneous/time.types";
import { PatientDetailsDto } from "../../../domain.types/users/patient/patient/patient.dto";
import { Roles } from "../../../domain.types/role/role.types";
import { ThirdpartyApiCredentialsDomainModel, ThirdpartyApiCredentialsDto } from "../../../domain.types/thirdparty/thirdparty.api.credentials";
import { FormsHandler } from "../../../modules/forms/forms.handler";
import { FileResourceService } from '../../general/file.resource.service';
import { Loader } from '../../../startup/loader';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class FormsService {

    constructor(
        @inject('IAssessmentTemplateRepo') private _assessmentTemplateRepo: IAssessmentTemplateRepo,
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
        @inject('IAssessmentHelperRepo') private _assessmentHelperRepo: IAssessmentHelperRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo
    ) {}

    public connectFormsProviderApi = async (connectionModel: ThirdpartyApiCredentialsDomainModel): Promise<boolean> => {
        return await FormsHandler.connect(connectionModel);
    };

    public getFormsList = async (connectionModel: ThirdpartyApiCredentialsDto): Promise<FormDto[]> => {
        return await FormsHandler.getFormsList(connectionModel);
    };

    public importFormAsAssessmentTemplate = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string)
            : Promise<CAssessmentTemplate> => {
        var downloadedFilepath = await FormsHandler.downloadForm(connectionModel, providerFormId);
        return await FormsHandler.importFormFileAsAssessmentTemplate(
            connectionModel, providerFormId, downloadedFilepath);
    };

    public formExists = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string)
        : Promise<boolean> => {
        return await FormsHandler.formExists(connectionModel, providerFormId);
    };

    public importFormSubmissions = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string)
        : Promise<any[]> => {
        return await FormsHandler.importFormSubmissions(connectionModel, providerFormId);
    };

    public getTemplateForForm = async (provider: string, providerFormId: string)
        : Promise<AssessmentTemplateDto> => {
        return await this._assessmentTemplateRepo.getByProviderAssessmentCode(provider, providerFormId);
    };

    public extractKeysForIdentification = (submission: any) => {

        const keysPhone = ['Phone', 'phone', 'Phone_Number', 'PhoneNumber', 'Phone_number', 'Mobile'];
        var phone = Helper.getValueForEitherKeys(submission, keysPhone);

        const keysEmail = ['Email', 'email', 'Email_Address', 'EmailAddress', 'email_address', 'email_id'];
        var email = Helper.getValueForEitherKeys(submission, keysEmail);

        const keysFirstName = ['FirstName', 'firstName', 'First_Name', 'first_name'];
        var firstName = Helper.getValueForEitherKeys(submission, keysFirstName);

        const keysLastName = ['LastName', 'lastName', 'Last_Name', 'last_name'];
        var lastName = Helper.getValueForEitherKeys(submission, keysLastName);

        return { phone, email, firstName, lastName };
    };

    public identifyUserDetailsFromSubmission = async (submission: any) => {
        try {
            var userId = null;
            var patient: PatientDetailsDto = null;

            const role = await this._roleRepo.getByName(Roles.Patient);

            var { phone, email, firstName, lastName } = this.extractKeysForIdentification(submission);
            if (phone !== null) {
                phone = phone.trim();
                const person = await this._personRepo.getPersonWithPhone(phone);
                if (person) {
                    var user = await this._userRepo.getByPhoneAndRole(phone, role.id);
                    if (user) {
                        userId = user.id;
                    }
                }
            }
            if (!userId) {
                if (email !== null) {
                    email = email.trim();
                    const person = await this._personRepo.getPersonWithEmail(email);
                    if (person) {
                        var user = await this._userRepo.getByEmailAndRole(email, role.id);
                        if (user) {
                            userId = user.id;
                        }
                    }
                }
            }
            if (userId != null) {
                patient = await this._patientRepo.getByUserId(userId);
            }
            return { patient, phone, email, firstName, lastName };
        }
        catch (error){
            throw new ApiError(500, `Error occurred processing submitted data: ${error.message}`);
        }
    };

    public addFormSubmissionAsAssessment = async (
        connectionModel: ThirdpartyApiCredentialsDto,
        patientUserId: uuid,
        templateId: uuid,
        providerFormId: string,
        submission: any)
        : Promise<AssessmentDto> => {

        const submissionKeys = Object.keys(submission);
        if (Helper.isEmptyObject(submission)) {
            return null;
        }
        if (submissionKeys.length === 0) {
            return null;
        }

        const template = await this._assessmentTemplateRepo.getById(templateId);

        const start = submission['start'] ? new Date(submission['start']) : new Date();
        const end = submission['end'] ? new Date(submission['end']) : new Date();
        const providerSubmissionId = submission['_id'] ?? null;
        var code = template.DisplayCode ? template.DisplayCode.split('#')[1] : '';
        var datestr = start.toISOString().split('T')[0];
        const displayCode = 'Assessment#' + code + ':' + datestr;

        const exists = await this._assessmentRepo.existsWithProviderSubmissionId(
            template.Provider, providerSubmissionId);
        if (exists) {
            Logger.instance().log(`Form submission with provider ${template.Provider} and submission id ${providerSubmissionId} has already been imported.`);
            return null;
        }

        const assessmentCreateModel: AssessmentDomainModel = {
            AssessmentTemplateId   : template.id,
            PatientUserId          : patientUserId,
            Title                  : template.Title,
            Type                   : template.Type,
            Provider               : template.Provider,
            ProviderAssessmentCode : template.ProviderAssessmentCode,
            ProviderAssessmentId   : providerSubmissionId,
            DisplayCode            : displayCode,
            Description            : template.Description,
            StartedAt              : start,
            FinishedAt             : end,
            Status                 : ProgressStatus.Completed
        };

        const assessment = await this._assessmentRepo.create(assessmentCreateModel);
        if (!assessment) {
            return null;
        }

        var nodes = await this._assessmentHelperRepo.getTemplateChildrenNodes(templateId);
        nodes = nodes.filter(x => x.NodeType !== AssessmentNodeType.NodeList && x.ProviderGivenCode !== null);
        nodes = nodes.sort((a, b) => {
            return a.Sequence - b.Sequence;
        });
        var nodeProviderCodes = nodes.map(x => x.ProviderGivenCode);

        var queryResponses = [];

        for await (var key of submissionKeys) {
            if (key === 'start' || key === 'end') {
                continue;
            }
            if (!nodeProviderCodes.includes(key)) {
                continue;
            }
            var value = submission[key];
            const node = nodes.find(x => x.ProviderGivenCode === key);
            if (node === null) {
                continue;
            }
            const answer = await this.getQueryResponse(
                connectionModel, template, assessment.id, node, value, submission);
            var response = await this._assessmentHelperRepo.createQueryResponse(answer);
            queryResponses.push(response);
        }
        assessment.UserResponses = queryResponses;

        return assessment;
    };

    private getQueryResponse = async (
        connectionModel: ThirdpartyApiCredentialsDto,
        template: AssessmentTemplateDto,
        assessmentId: uuid,
        node: CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode,
        value: any,
        submission: any): Promise<SingleChoiceQueryAnswer
        | MultipleChoiceQueryAnswer
        | MessageAnswer
        | TextQueryAnswer
        | IntegerQueryAnswer
        | FloatQueryAnswer
        | BooleanQueryAnswer
        | FileQueryAnswer
        | BiometricQueryAnswer> => {

        if (node.NodeType === AssessmentNodeType.Question) {
            const nd = node as CAssessmentQuestionNode;
            if (nd.QueryResponseType === QueryResponseType.SingleChoiceSelection) {
                return await this.getSingleChoiceQueryResponse(value, nd, assessmentId, node);
            }
            else if (nd.QueryResponseType === QueryResponseType.MultiChoiceSelection) {
                const provider = template.Provider;
                var v = FormsHandler.processQueryResponse(provider, QueryResponseType.MultiChoiceSelection, value);
                const multiChoiceValues: string[] = v as string[];
                return await this.getMultiChoiceQueryResponse(multiChoiceValues, nd, assessmentId, node);
            }
            else if (nd.QueryResponseType === QueryResponseType.Text) {
                return await this.getTextQueryResponse(value, nd, assessmentId, node);
            }
            else if (nd.QueryResponseType === QueryResponseType.Boolean) {
                return await this.getBooleanQueryResponse(value, nd, assessmentId, node);
            }
            else if (nd.QueryResponseType === QueryResponseType.Date ||
                nd.QueryResponseType === QueryResponseType.DateTime) {
                return await this.getDateQueryResponse(value, nd, assessmentId, node);
            }
            else if (nd.QueryResponseType === QueryResponseType.Integer) {
                return await this.getIntegerQueryResponse(value, nd, assessmentId, node);
            }
            else if (nd.QueryResponseType === QueryResponseType.Float) {
                return await this.getFloatQueryResponse(value, nd, assessmentId, node);
            }
            else if (nd.QueryResponseType === QueryResponseType.File) {
                var filename = value as string;
                var fileValue = {
                    FileName   : filename,
                    ResourceId : null,
                    Url        : null
                };
                var attachment = submission._attachments.find(x => x.filename.includes(filename));
                if (attachment) {
                    fileValue.Url = attachment.download_url;
                    var downloadedFilepath = await FormsHandler.downloadFile(connectionModel, fileValue.Url);
                    if (downloadedFilepath) {
                        var fileDto = await this.uploadFile(downloadedFilepath);
                        fileValue.ResourceId = fileDto.id;
                    }
                }
                return await this.getFileQueryResponse(fileValue, nd, assessmentId, node);
            }
        }
    };

    private uploadFile = async (sourceLocation: string): Promise<FileResourceDto> => {
        const filename = path.basename(sourceLocation);
        const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        const storageKey = `resources/${dateFolder}/${filename}`;
        const fileResourceService = Loader.container.resolve(FileResourceService);
        return await fileResourceService.uploadLocal(sourceLocation, storageKey, false);
    };

    private async getSingleChoiceQueryResponse(
        value: any, nd: CAssessmentQuestionNode,
        assessmentId: string, node: CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode) {

        const v = value as string;
        const options = await this._assessmentHelperRepo.getQuestionNodeOptions(nd.NodeType, nd.id);
        const option = options.find(x => x.Text.toLowerCase() === v.toLowerCase());
        const answer: SingleChoiceQueryAnswer = {
            AssessmentId     : assessmentId,
            ChosenSequence   : option.Sequence,
            QuestionSequence : node.Sequence,
            ResponseType     : QueryResponseType.SingleChoiceSelection,
            ChosenOption     : option,
            NodeDisplayCode  : nd.DisplayCode,
            NodeId           : nd.id,
            Title            : node.Title
        };
        return answer;
    }

    private async getMultiChoiceQueryResponse(
        value: string[], nd: CAssessmentQuestionNode,
        assessmentId: string, node: CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode) {

        var v = value.map(x => x.toLowerCase());
        const options = await this._assessmentHelperRepo.getQuestionNodeOptions(nd.NodeType, nd.id);
        var selectedOptionSequences:number[] = [];
        var selectedOptions:CAssessmentQueryOption[] = [];
        for (var o of options) {
            const searchFor = o.Text.toLowerCase();
            if (v.includes(searchFor)) {
                selectedOptionSequences.push(o.Sequence);
                selectedOptions.push(o);
            }
        }
        const answer: MultipleChoiceQueryAnswer = {
            AssessmentId     : assessmentId,
            ChosenSequences  : selectedOptionSequences,
            QuestionSequence : node.Sequence,
            ResponseType     : QueryResponseType.MultiChoiceSelection,
            ChosenOptions    : selectedOptions,
            NodeDisplayCode  : nd.DisplayCode,
            NodeId           : nd.id,
            Title            : node.Title
        };
        return answer;
    }

    private async getTextQueryResponse(
        value: any, nd: CAssessmentQuestionNode,
        assessmentId: string, node: CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode) {
        const answer: TextQueryAnswer = {
            AssessmentId     : assessmentId,
            Text             : value as string,
            QuestionSequence : node.Sequence,
            ResponseType     : QueryResponseType.Text,
            NodeDisplayCode  : nd.DisplayCode,
            NodeId           : nd.id,
            Title            : node.Title
        };
        return answer;
    }

    private async getBooleanQueryResponse(
        value: any, nd: CAssessmentQuestionNode,
        assessmentId: string, node: CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode) {
        const answer: BooleanQueryAnswer = {
            AssessmentId     : assessmentId,
            Value            : value as boolean,
            QuestionSequence : node.Sequence,
            ResponseType     : QueryResponseType.Boolean,
            NodeDisplayCode  : nd.DisplayCode,
            NodeId           : nd.id,
            Title            : node.Title
        };
        return answer;
    }

    private async getDateQueryResponse(
        value: any, nd: CAssessmentQuestionNode,
        assessmentId: string, node: CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode) {
        const answer: DateQueryAnswer = {
            AssessmentId     : assessmentId,
            Date             : new Date(value.toString()),
            QuestionSequence : node.Sequence,
            ResponseType     : QueryResponseType.Date,
            NodeDisplayCode  : nd.DisplayCode,
            NodeId           : nd.id,
            Title            : node.Title
        };
        return answer;
    }

    private async getIntegerQueryResponse(
        value: any, nd: CAssessmentQuestionNode,
        assessmentId: string, node: CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode) {
        const answer: IntegerQueryAnswer = {
            AssessmentId     : assessmentId,
            Value            : value as number,
            QuestionSequence : node.Sequence,
            ResponseType     : QueryResponseType.Integer,
            NodeDisplayCode  : nd.DisplayCode,
            NodeId           : nd.id,
            Title            : node.Title
        };
        return answer;
    }

    private async getFloatQueryResponse(
        value: any, nd: CAssessmentQuestionNode,
        assessmentId: string, node: CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode) {
        const answer: FloatQueryAnswer = {
            AssessmentId     : assessmentId,
            Value            : value as number,
            QuestionSequence : node.Sequence,
            ResponseType     : QueryResponseType.Float,
            NodeDisplayCode  : nd.DisplayCode,
            NodeId           : nd.id,
            Title            : node.Title
        };
        return answer;
    }

    private async getFileQueryResponse(
        value: any, nd: CAssessmentQuestionNode,
        assessmentId: string, node: CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode) {

        const answer: FileQueryAnswer = {
            AssessmentId     : assessmentId,
            Url              : value.Url,
            ResourceId       : value.ResourceId,
            Field            : value.FileName,
            Filepath         : value.FileName,
            QuestionSequence : node.Sequence,
            ResponseType     : QueryResponseType.File,
            NodeDisplayCode  : nd.DisplayCode,
            NodeId           : nd.id,
            Title            : node.Title,
        };
        return answer;
    }

}

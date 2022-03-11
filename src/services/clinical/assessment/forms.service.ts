import { AssessmentNodeType, BiometricQueryAnswer, CAssessmentListNode, CAssessmentMessageNode, CAssessmentQueryOption, CAssessmentQuestionNode, CAssessmentTemplate, FloatQueryAnswer, IntegerQueryAnswer, MessageAnswer, MultipleChoiceQueryAnswer, QueryResponseType, SingleChoiceQueryAnswer, TextQueryAnswer } from "../../../domain.types/clinical/assessment/assessment.types";
import { inject, injectable } from "tsyringe";
import { IAssessmentHelperRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface";
import { IAssessmentRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface";
import { IAssessmentTemplateRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface";
import { FormDto } from "../../../domain.types/clinical/assessment/form.types";
import { ThirdpartyApiCredentialsDomainModel, ThirdpartyApiCredentialsDto } from "../../../domain.types/thirdparty/thirdparty.api.credentials";
import { FormsHandler } from "../../../modules/forms/forms.handler";
import { AssessmentTemplateDto } from "../../../domain.types/clinical/assessment/assessment.template.dto";
import { AssessmentDto } from "../../../domain.types/clinical/assessment/assessment.dto";
import { ProgressStatus, uuid } from "../../../domain.types/miscellaneous/system.types";
import { PatientDetailsDto } from "../../../domain.types/patient/patient/patient.dto";
import { ApiError } from "../../../common/api.error";
import { Helper } from "../../../common/helper";
import { IPersonRepo } from "../../../database/repository.interfaces/person.repo.interface";
import { IRoleRepo } from "../../../database/repository.interfaces/role.repo.interface";
import { IUserRepo } from "../../../database/repository.interfaces/user/user.repo.interface";
import { IPatientRepo } from "../../../database/repository.interfaces/patient/patient.repo.interface";
import { Roles } from "../../../domain.types/role/role.types";
import { AssessmentDomainModel } from "../../../domain.types/clinical/assessment/assessment.domain.model";
import { AssessmentValidator } from "src/api/validators/clinical/assessment/assessment.validator";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class FormsService {

    _handler: FormsHandler = new FormsHandler();

    constructor(
        @inject('IAssessmentTemplateRepo') private _assessmentTemplateRepo: IAssessmentTemplateRepo,
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
        @inject('IAssessmentHelperRepo') private _assessmentHelperRepo: IAssessmentHelperRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        //@inject('IFormsRepo') private _formsRepo: IFormsRepo,
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
        var assessmentTemplate = await FormsHandler.importFormFileAsAssessmentTemplate(
            connectionModel, providerFormId, downloadedFilepath);
        return assessmentTemplate;
    };

    public formExists = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string)
        : Promise<boolean> => {
        return await FormsHandler.formExists(connectionModel, providerFormId);
    };

    public importFormSubmissions = async (connectionModel: ThirdpartyApiCredentialsDto, providerFormId: string)
        : Promise<any[]> => {
        return await FormsHandler.importFormSubmissions(connectionModel, providerFormId);
    }

    public getTemplateForForm = async (provider: string, providerFormId: string)
        : Promise<AssessmentTemplateDto> => {
        return await this._assessmentTemplateRepo.getByProviderAssessmentCode(provider, providerFormId);
    }

    public IdentifyUserDetailsFromSubmission = async (submission: any): Promise<PatientDetailsDto> => {
        try {
            var userId = null;
            const role = await this._roleRepo.getByName(Roles.Patient);
            const keysPhone = ['Phone', 'phone', 'Phone_Number', 'PhoneNumber', 'Phone_number', 'Mobile'];
            var phone = Helper.getValueForEitherKeys(submission, keysPhone);
            phone = phone.trim();
            if (phone !== null) {
                const person = await this._personRepo.getPersonWithPhone(phone);
                if (person) {
                    var user = await this._userRepo.getByPhoneAndRole(phone, role.id);
                    if (user) {
                        userId = user.id;
                    }
                }
            }
            if (!userId) {
                const keysEmail = ['Email', 'email', 'Email_Address', 'EmailAddress', 'email_address', 'email_id'];
                var email = Helper.getValueForEitherKeys(submission, keysEmail);
                email = email.trim();
                if (email !== null) {
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
                return await this._patientRepo.getByUserId(userId);
            }
            return null;
        }
        catch (error){
            throw new ApiError(500, `Error occurred processing submitted data: ${error.message}`);
        }
    }

    public addAssessment = async (patientUserId: uuid, templateId: uuid, providerFormId: string, submission: any)
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
        if (assessment) {
            return null;
        }

        var nodes = await this._assessmentHelperRepo.getTemplateChildrenNodes(templateId);
        nodes = nodes.filter(x => x.NodeType !== AssessmentNodeType.NodeList && x.ProviderGivenCode !== null);
        nodes = nodes.sort((a, b) => {
            return a.Sequence - b.Sequence;
        });
        var nodeProviderCodes = nodes.map(x => x.ProviderGivenCode);

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
            const answer = this.getQueryResponse(template, assessment.id, node, value);
            var response = await this._assessmentHelperRepo.createQueryResponse(answer);
        }

    }

    // public getById = async (id: string): Promise<AssessmentTemplateDto> => {
    //     return await this._assessmentRepo.getById(id);
    // };

    // public search = async (filters: AssessmentTemplateSearchFilters): Promise<AssessmentTemplateSearchResults> => {
    //     return await this._assessmentRepo.search(filters);
    // };

    // public update = async (id: string, assessmentDomainModel: AssessmentTemplateDomainModel):
    //     Promise<AssessmentTemplateDto> => {
    //     return await this._assessmentRepo.update(id, assessmentDomainModel);
    // };

    // public delete = async (id: string): Promise<boolean> => {
    //     return await this._assessmentRepo.delete(id);
    // };

    private getQueryResponse = async (
        template: AssessmentTemplateDto,
        assessmentId: uuid,
        node: CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode,
        value: any): Promise<SingleChoiceQueryAnswer
        | MultipleChoiceQueryAnswer
        | MessageAnswer
        | TextQueryAnswer
        | IntegerQueryAnswer
        | FloatQueryAnswer
        | BiometricQueryAnswer> => {
            
        if (node.NodeType === AssessmentNodeType.Question) {
            const nd = node as CAssessmentQuestionNode;
            if (nd.QueryResponseType === QueryResponseType.SingleChoiceSelection) {
                return await this.getSingleChoiceQueryResponse(value, nd, assessmentId, node);
            }
        }
    };

    private async getSingleChoiceQueryResponse(
        value: any, nd: CAssessmentQuestionNode,
        assessmentId: string, node: CAssessmentQuestionNode | CAssessmentListNode | CAssessmentMessageNode) {
        const v = value as string;
        const options = await this._assessmentHelperRepo.getQuestionNodeOptions(nd.NodeType, nd.id);
        const option = options.find(x => x.Text === v);
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

}

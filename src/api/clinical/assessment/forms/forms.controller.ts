import express from 'express';
import { AssessmentDto } from '../../../../domain.types/clinical/assessment/assessment.dto';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { FormDto } from '../../../../domain.types/clinical/assessment/form.types';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ThirdpartyApiCredentialsDto } from '../../../../domain.types/thirdparty/thirdparty.api.credentials';
import { AssessmentService } from '../../../../services/clinical/assessment/assessment.service';
import { AssessmentTemplateService } from '../../../../services/clinical/assessment/assessment.template.service';
import { FormsService } from '../../../../services/clinical/assessment/forms.service';
import { ThirdpartyApiService } from '../../../../services/general/thirdparty.api.service';
import { Loader } from '../../../../startup/loader';
import { FormsValidator } from './forms.validator';
import { FileResourceValidator } from '../../../general/file.resource/file.resource.validator';
import { BaseController } from '../../../base.controller';
import { Logger } from '../../../../common/logger';
import { PatientDetailsDto } from '../../../../domain.types/users/patient/patient/patient.dto';
import { PatientDomainModel } from '../../../../domain.types/users/patient/patient/patient.domain.model';
import { UserService } from '../../../../services/users/user/user.service';
import { PersonService } from '../../../../services/person/person.service';
import { UserHelper } from '../../../users/user.helper';

///////////////////////////////////////////////////////////////////////////////////////

export class FormsController extends BaseController{

    //#region member variables and constructors

    _service: FormsService = null;

    _assessmentTemplateService: AssessmentTemplateService = null;

    _assessmentService: AssessmentService = null;

    _thirdpartyApiService: ThirdpartyApiService = null;

    _userService: UserService = null;

    _personService: PersonService = null;

    _validator: FormsValidator = new FormsValidator();

    _fileResourceValidator: FileResourceValidator = new FileResourceValidator();

    _userHelper: UserHelper = new UserHelper();

    constructor() {
        super();
        this._service = Loader.container.resolve(FormsService);
        this._assessmentTemplateService = Loader.container.resolve(AssessmentTemplateService);
        this._assessmentService = Loader.container.resolve(AssessmentService);
        this._thirdpartyApiService = Loader.container.resolve(ThirdpartyApiService);
        this._userService = Loader.container.resolve(UserService);
        this._personService = Loader.container.resolve(PersonService);
    }

    //#endregion

    //#region Action methods

    connect = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Forms.Connect', request, response);
            var connectionModel = await this._validator.connect(request);

            const provider = connectionModel.Provider;
            const incoming = connectionModel.BaseUrl != null;
            var existingCreds = await this._thirdpartyApiService.getThirdpartyCredentials(
                request.currentUser.UserId, connectionModel.Provider, connectionModel.BaseUrl);
            const existing = existingCreds != null;
            var expired  = false;
            if (existingCreds && existingCreds.ValidTill) {
                expired = new Date(existingCreds.ValidTill) < new Date();
            }
            if (!incoming && !existing) {
                throw new ApiError(403, `Cannot find provider access credentials for ${provider}!`);
            }
            if (!incoming) {
                connectionModel.BaseUrl = existingCreds.BaseUrl;
                connectionModel.SecondaryUrl = existingCreds.SecondaryUrl;
                connectionModel.Token = existingCreds.Token;
                connectionModel.ValidTill = existingCreds.ValidTill;
            }
            else if ( incoming && (expired || !existingCreds)) {
                await this._thirdpartyApiService.addThirdpartyCredentials(
                    request.currentUser.UserId, connectionModel);
            }

            var successful = await this._service.connectFormsProviderApi(connectionModel);
            if (!successful) {
                throw new ApiError(403, `Cannot access provider Api for ${connectionModel.Provider}!`);
            }

            ResponseHandler.success(request, response, `Successfully conencted to provider api - ${connectionModel.Provider}!`, 200, {
                Connected : true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getFormsList = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Forms.GetFormsList', request, response);

            const userId: uuid = request.currentUser.UserId;
            const provider = request.params.providerCode;

            var validCreds: ThirdpartyApiCredentialsDto = await this.getValidCreds(userId, provider);
            if (!validCreds) {
                throw new ApiError(403, `This user does not have valid credentials to fetch data from provider ${provider}!`);
            }

            const formsList = await this._service.getFormsList(validCreds);
            var forms: FormDto[] = [];
            for await (var f of formsList) {
                const providerFormId = f.ProviderId;
                var assessmentTemplate =
                    await this._assessmentTemplateService.getByProviderAssessmentCode(provider, providerFormId);
                f['AssessmentTemplate'] = assessmentTemplate;
                forms.push(f);
            }
            const message = forms.length === 0
                ? 'No records found!'
                : `Total ${forms.length} form/s retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                UserId   : userId,
                Provider : provider,
                Forms    : forms });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    importFormAsAssessmentTemplate = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Forms.ImportFormAsAssessmentTemplate', request, response);

            const userId: uuid = request.currentUser.UserId;
            const provider = request.params.providerCode;
            const providerFormId = request.params.providerFormId;

            var validCreds: ThirdpartyApiCredentialsDto = await this.getValidCreds(userId, provider);
            if (!validCreds) {
                throw new ApiError(403, `This user does not have valid credentials to fetch data from provider ${provider}!`);
            }

            const formExists = await this._service.formExists(validCreds, providerFormId);
            if (!formExists) {
                throw new ApiError(404, `The form with id ${providerFormId} cannot be found!`);
            }

            const assessmentTemplate = await this._service.importFormAsAssessmentTemplate(validCreds, providerFormId);
            if (!assessmentTemplate) {
                throw new ApiError(404, `An error has occurred while importing form with id ${providerFormId}!`);
            }

            const template = await this._assessmentTemplateService.addTemplate(assessmentTemplate);

            const message = `The form with id ${providerFormId} is successfully converted to the assessment template successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                AssessmentTemplate : template });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    importFormSubmissions = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Forms.ImportFormSubmissions', request, response);

            const userId: uuid = request.currentUser.UserId;
            const provider = request.params.providerCode;
            const providerFormId = request.params.providerFormId;
            const addUserIfNeeded = request.body.AddUserIfNeeded;

            var validCreds: ThirdpartyApiCredentialsDto = await this.getValidCreds(userId, provider);
            if (!validCreds) {
                throw new ApiError(403, `This user does not have valid credentials to fetch data from provider ${provider}!`);
            }

            const formExists = await this._service.formExists(validCreds, providerFormId);
            if (!formExists) {
                throw new ApiError(404, `The form with id ${providerFormId} cannot be found!`);
            }

            var template = await this._service.getTemplateForForm(provider, providerFormId);
            if (!template) {
                const assessmentTemplate =
                    await this._service.importFormAsAssessmentTemplate(validCreds, providerFormId);
                if (!assessmentTemplate) {
                    throw new ApiError(500, `An error has occurred while importing form with id ${providerFormId}!`);
                }
                template = await this._assessmentTemplateService.addTemplate(assessmentTemplate);
                if (!template) {
                    throw new ApiError(500, `An error has occurred while adding template for form with id ${providerFormId}!`);
                }
            }
            const templateId = template.id;
            const formSubmissions = await this._service.importFormSubmissions(validCreds, providerFormId);
            if (!formSubmissions || formSubmissions.length === 0) {
                throw new ApiError(404, `Cannot locate form submissions for the form with id ${providerFormId}!`);
            }

            const assessments: AssessmentDto[] = [];

            for await (var submission of formSubmissions) {

                var { patient, phone, email, firstName, lastName } =
                    await this._service.identifyUserDetailsFromSubmission(submission);

                if (!patient) {
                    if (!addUserIfNeeded) {
                        Logger.instance().log(`Cannot import form submisison as an assessment for the form with id ${providerFormId} as patient info cannot be determined.`);
                        continue;
                    }
                    patient = await this.createPatient(phone, email, firstName, lastName);
                    if (!patient) {
                        Logger.instance().log(`Cannot import form submisison as an assessment for the form with id ${providerFormId} as patient info cannot be determined.`);
                        continue;
                    }
                }
                const assessment: AssessmentDto =
                    await this._service.addFormSubmissionAsAssessment(
                        validCreds, patient.UserId, templateId, providerFormId, submission);
                assessments.push(assessment);
            }

            const message = `The submissions for form with id ${providerFormId} are imported as completed assessments successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Assessments : assessments });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    private async getValidCreds(userId: string, provider: string) {

        var existingCredsList = await this._thirdpartyApiService.getThirdpartyCredentialsForUser(
            userId, provider);

        var validCreds: ThirdpartyApiCredentialsDto = existingCredsList.find(x => {
            return x.ValidTill === null || x.ValidTill > new Date();
        });
        return validCreds;
    }

    private createPatient = async (phone: string, email: string, firstName: string, lastName: string)
        : Promise<PatientDetailsDto> => {

        const createModel: PatientDomainModel = {
            User : {
                Person : {
                    FirstName : firstName ?? null,
                    LastName  : lastName ?? null,
                    Phone     : phone ?? null,
                    Email     : email ?? null,
                },
            },
        };

        const [patient, createdNew] = await this._userHelper.createPatient(createModel);

        if (!createdNew) {
            const str = JSON.stringify(createModel, null, 2);
            Logger.instance().log(`Patient account already exists with following details - ${str}!`);
        }

        return patient;
    };

}

import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { FormDto } from '../../../../domain.types/clinical/assessment/form.types';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ThirdpartyApiCredentialsDto } from '../../../../domain.types/thirdparty/thirdparty.api.credentials';
import { AssessmentService } from '../../../../services/clinical/assessment/assessment.service';
import { AssessmentTemplateService } from '../../../../services/clinical/assessment/assessment.template.service';
import { FormsService } from '../../../../services/clinical/assessment/forms.service';
import { ThirdpartyApiService } from '../../../../services/thirdparty/thirdparty.api.service';
import { Loader } from '../../../../startup/loader';
import { FormsValidator } from '../../../validators/clinical/assessment/forms.validator';
import { FileResourceValidator } from '../../../validators/file.resource.validator';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class FormsController extends BaseController{

    //#region member variables and constructors

    _service: FormsService = null;

    _assessmentTemplateService: AssessmentTemplateService = null;

    _assessmentService: AssessmentService = null;

    _thirdpartyApiService: ThirdpartyApiService = null;

    _validator: FormsValidator = new FormsValidator();

    _fileResourceValidator: FileResourceValidator = new FileResourceValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(FormsService);
        this._assessmentTemplateService = Loader.container.resolve(AssessmentTemplateService);
        this._assessmentService = Loader.container.resolve(AssessmentService);
        this._thirdpartyApiService = Loader.container.resolve(ThirdpartyApiService);
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
    }

    // exportAssessmentTemplateAsForm = async (request: express.Request, response: express.Response): Promise<void> => {
    //     try {
            
    //         await this.setContext('Forms.ExportAssessmentTemplateAsForm', request, response);

    //         const model = await this._validator.create(request);
    //         const assessmentTemplate = await this._service.create(model);
    //         if (assessmentTemplate == null) {
    //             throw new ApiError(400, 'Cannot create record for assessment Template!');
    //         }

    //         ResponseHandler.success(request, response, 'Assessment template record created successfully!', 201, {
    //             AssessmentTemplate : assessmentTemplate,
    //         });
    //     } catch (error) {
    //         ResponseHandler.handleError(request, response, error);
    //     }
    // };

    // addAssessmentTemplateAsForm = async (request: express.Request, response: express.Response): Promise<void> => {
    //     try {
            
    //         await this.setContext('Forms.AddAssessmentTemplateAsForm', request, response);

    //         const id: uuid = await this._validator.getParamUuid(request, 'id');
    //         const assessmentTemplate = await this._service.getById(id);
    //         if (assessmentTemplate == null) {
    //             throw new ApiError(404, 'Assessment template record not found.');
    //         }

    //         ResponseHandler.success(request, response, 'Assessment template record retrieved successfully!', 200, {
    //             AssessmentTemplate : assessmentTemplate,
    //         });
    //     } catch (error) {
    //         ResponseHandler.handleError(request, response, error);
    //     }
    // };

    getFormsList = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('Forms.GetFormsList', request, response);

            const userId: uuid = request.currentUser.UserId;
            const provider = request.params.providerCode;

            var existingCredsList = await this._thirdpartyApiService.getThirdpartyCredentialsForUser(
                request.currentUser.UserId, provider);
            
            var validCreds: ThirdpartyApiCredentialsDto = existingCredsList.find(x => {
                return x.ValidTill === null || x.ValidTill > new Date();
            });
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

    // importFormAsAssessmentTemplate = async (request: express.Request, response: express.Response): Promise<void> => {
    //     try {
            
    //         await this.setContext('Forms.ImportFormAsAssessmentTemplate', request, response);

    //         const filters = await this._validator.search(request);
    //         const searchResults = await this._service.search(filters);

    //         const count = searchResults.Items.length;

    //         const message =
    //             count === 0
    //                 ? 'No records found!'
    //                 : `Total ${count} assessmentTemplate records retrieved successfully!`;
                    
    //         ResponseHandler.success(request, response, message, 200, {
    //             AssessmentTemplateRecords : searchResults });

    //     } catch (error) {
    //         ResponseHandler.handleError(request, response, error);
    //     }
    // };

    // importFormSubmissions = async (request: express.Request, response: express.Response): Promise<void> => {
    //     try {
            
    //         await this.setContext('Forms.ImportFormSubmissions', request, response);

    //         const domainModel = await this._validator.update(request);
    //         const id: uuid = await this._validator.getParamUuid(request, 'id');
    //         const existingRecord = await this._service.getById(id);
    //         if (existingRecord == null) {
    //             throw new ApiError(404, 'Assessment template record not found.');
    //         }

    //         const updated = await this._service.update(domainModel.id, domainModel);
    //         if (updated == null) {
    //             throw new ApiError(400, 'Unable to update assessmentTemplate record!');
    //         }

    //         ResponseHandler.success(request, response, 'Assessment template record updated successfully!', 200, {
    //             AssessmentTemplate : updated,
    //         });
    //     } catch (error) {
    //         ResponseHandler.handleError(request, response, error);
    //     }
    // };

    //#endregion

}

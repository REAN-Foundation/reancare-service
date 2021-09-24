import express from 'express';

import { Helper } from '../../../../common/helper';
import { ResponseHandler } from '../../../../common/response.handler';
import { Loader } from '../../../../startup/loader';
import { Authorizer } from '../../../../auth/authorizer';

import { ApiError } from '../../../../common/api.error';
import { SymptomAssessmentTemplateValidator } from '../../../validators/clinical/symptom/symptom.assessment.template.validator';
import { SymptomAssessmentTemplateService } from '../../../../services/clinical/symptom/symptom.assessment.template.service';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentTemplateController {

    //#region member variables and constructors

    _service: SymptomAssessmentTemplateService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(SymptomAssessmentTemplateService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'SymptomAssessmentTemplate.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await SymptomAssessmentTemplateValidator.create(request);

            const template = await this._service.create(domainModel);
            if (template == null) {
                throw new ApiError(400, 'Cannot create template!');
            }

            ResponseHandler.success(request, response, 'Symptom assessment template created successfully!', 201, {
                SymptomAssessmentTemplate : template,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'SymptomAssessmentTemplate.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await SymptomAssessmentTemplateValidator.getById(request);

            const template = await this._service.getById(id);
            if (template == null) {
                throw new ApiError(404, 'Symptom assessment template not found.');
            }

            ResponseHandler.success(request, response, 'Symptom assessment template retrieved successfully!', 200, {
                SymptomAssessmentTemplate : template,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'SymptomAssessmentTemplate.Search';
            await this._authorizer.authorize(request, response);

            const filters = await SymptomAssessmentTemplateValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} template records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { SymptomAssessmentTemplates: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'SymptomAssessmentTemplate.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await SymptomAssessmentTemplateValidator.update(request);

            const id: string = await SymptomAssessmentTemplateValidator.getById(request);
            const existingSymptomAssessmentTemplate = await this._service.getById(id);
            if (existingSymptomAssessmentTemplate == null) {
                throw new ApiError(404, 'Symptom assessment template not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update template record!');
            }

            ResponseHandler.success(request, response, 'Symptom assessment template record updated successfully!', 200, {
                SymptomAssessmentTemplate : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'SymptomAssessmentTemplate.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await SymptomAssessmentTemplateValidator.getById(request);
            const existingSymptomAssessmentTemplate = await this._service.getById(id);
            if (existingSymptomAssessmentTemplate == null) {
                throw new ApiError(404, 'Symptom assessment template not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Symptom assessment template cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Symptom assessment template record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    addSymptomAssessmentTemplates = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'SymptomAssessmentTemplate.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await SymptomAssessmentTemplateValidator.getById(request);
            const existingSymptomAssessmentTemplate = await this._service.getById(id);
            if (existingSymptomAssessmentTemplate == null) {
                throw new ApiError(404, 'Symptom assessment template not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Symptom assessment template cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Symptom assessment template record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    removeSymptomAssessmentTemplates = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'SymptomAssessmentTemplate.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await SymptomAssessmentTemplateValidator.getById(request);
            const existingSymptomAssessmentTemplate = await this._service.getById(id);
            if (existingSymptomAssessmentTemplate == null) {
                throw new ApiError(404, 'Symptom assessment template not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Symptom assessment template cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Symptom assessment template record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

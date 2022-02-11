import express from 'express';
import { Authorizer } from '../../../../auth/authorizer';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { SymptomAssessmentTemplateService } from '../../../../services/clinical/symptom/symptom.assessment.template.service';
import { Loader } from '../../../../startup/loader';
import { SymptomAssessmentTemplateValidator } from '../../../validators/clinical/symptom/symptom.assessment.template.validator';

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

            const exists = await this._service.exists(id);
            if (!exists) {
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

            const exists = await this._service.exists(id);
            if (!exists) {
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

    addSymptomTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'SymptomAssessmentTemplate.AddSymptomTypes';
            await this._authorizer.authorize(request, response);

            const x = await SymptomAssessmentTemplateValidator.addRemoveSymptomTypes(request);

            const exists = await this._service.exists(x.id);
            if (!exists) {
                throw new ApiError(404, 'Symptom assessment template not found.');
            }

            const template = await this._service.addSymptomTypes(x.id, x.SymptomTypeIds);
            if (template === null) {
                throw new ApiError(400, 'Symptom types cannot be added.');
            }

            ResponseHandler.success(request, response, 'Symptom types added to template successfully!', 200, {
                SymptomAssessmentTemplate : template,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    removeSymptomTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'SymptomAssessmentTemplate.RemoveSymptomTypes';
            await this._authorizer.authorize(request, response);

            const x = await SymptomAssessmentTemplateValidator.addRemoveSymptomTypes(request);

            const exists = await this._service.exists(x.id);
            if (!exists) {
                throw new ApiError(404, 'Symptom assessment template not found.');
            }

            const template = await this._service.removeSymptomTypes(x.id, x.SymptomTypeIds);
            if (template === null) {
                throw new ApiError(400, 'Symptom types cannot be removed.');
            }

            ResponseHandler.success(request, response, 'Symptom types removed from template successfully!', 200, {
                SymptomAssessmentTemplate : template
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

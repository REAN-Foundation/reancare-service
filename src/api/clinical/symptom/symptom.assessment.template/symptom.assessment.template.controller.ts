import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { SymptomAssessmentTemplateService } from '../../../../services/clinical/symptom/symptom.assessment.template.service';
import { Loader } from '../../../../startup/loader';
import { SymptomAssessmentTemplateValidator } from './symptom.assessment.template.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentTemplateController extends BaseController {

    //#region member variables and constructors

    _service: SymptomAssessmentTemplateService = null;

    _validator: SymptomAssessmentTemplateValidator = new SymptomAssessmentTemplateValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(SymptomAssessmentTemplateService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('SymptomAssessmentTemplate.Create', request, response);

            const domainModel = await this._validator.create(request);

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

            await this.setContext('SymptomAssessmentTemplate.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

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
            await this.setContext('SymptomAssessmentTemplate.Search', request, response);

            const filters = await this._validator.search(request);

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

            await this.setContext('SymptomAssessmentTemplate.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');

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
            await this.setContext('SymptomAssessmentTemplate.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

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
            await this.setContext('SymptomAssessmentTemplate.AddSymptomTypes', request, response);

            const x = await this._validator.addRemoveSymptomTypes(request);

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
            await this.setContext('SymptomAssessmentTemplate.RemoveSymptomTypes', request, response);

            const x = await this._validator.addRemoveSymptomTypes(request);

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

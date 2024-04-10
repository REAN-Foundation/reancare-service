import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { SymptomAssessmentTemplateService } from '../../../../services/clinical/symptom/symptom.assessment.template.service';
import { Injector } from '../../../../startup/injector';
import { SymptomAssessmentTemplateValidator } from './symptom.assessment.template.validator';
import { BaseController } from '../../../base.controller';
import { SymptomAssessmentTemplateDomainModel } from '../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.domain.model';
import { SymptomAssessmentTemplateSearchFilters } from '../../../../domain.types/clinical/symptom/symptom.assessment.template/symptom.assessment.template.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentTemplateController extends BaseController {

    //#region member variables and constructors

    _service: SymptomAssessmentTemplateService = Injector.Container.resolve(SymptomAssessmentTemplateService);

    _validator: SymptomAssessmentTemplateValidator = new SymptomAssessmentTemplateValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model: SymptomAssessmentTemplateDomainModel = await this._validator.create(request);
            await this.authorizeOne(request, null, model.TenantId);
            const template = await this._service.create(model);
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

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Symptom assessment template not found.');
            }
            await this.authorizeOne(request, null, record.TenantId);

            ResponseHandler.success(request, response, 'Symptom assessment template retrieved successfully!', 200, {
                SymptomAssessmentTemplate : record,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            let filters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
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

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Symptom assessment template not found.');
            }
            await this.authorizeOne(request, null, record.TenantId);

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

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Symptom assessment template not found.');
            }
            await this.authorizeOne(request, null, record.TenantId);

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

    //#region Authorization

    authorizeSearch = async (
        request: express.Request,
        searchFilters: SymptomAssessmentTemplateSearchFilters): Promise<SymptomAssessmentTemplateSearchFilters> => {

        if (searchFilters.TenantId != null) {
            if (searchFilters.TenantId !== request.currentUser.TenantId) {
                throw new ApiError(403, 'Forbidden');
            }
        }
        else {
            searchFilters.TenantId = request.currentUser.TenantId;
        }
        return searchFilters;
    };

    //#endregion
}

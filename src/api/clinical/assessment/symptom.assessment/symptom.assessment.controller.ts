import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { SymptomAssessmentService } from '../../../../services/clinical/symptom/symptom.assessment.service';
import { Injector } from '../../../../startup/injector';
import { SymptomAssessmentValidator } from './symptom.assessment.validator';
import { BaseController } from '../../../base.controller';
import { SymptomAssessmentSearchFilters } from '../../../../domain.types/clinical/symptom/symptom.assessment/symptom.assessment.search.types';
import { PermissionHandler } from '../../../../auth/custom/permission.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentController extends BaseController {

    //#region member variables and constructors

    _service: SymptomAssessmentService = Injector.Container.resolve(SymptomAssessmentService);

    _validator: SymptomAssessmentValidator = new SymptomAssessmentValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.create(request);
            await this.authorizeOne(request, model.PatientUserId, null);
            const assessment = await this._service.create(model);
            if (assessment == null) {
                throw new ApiError(400, 'Cannot create assessment!');
            }
            ResponseHandler.success(request, response, 'Symptom assessment created successfully!', 201, {
                SymptomAssessment : assessment,
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
                throw new ApiError(404, 'Symptom assessment not found.');
            }
            await this.authorizeOne(request, record.PatientUserId, null);
            ResponseHandler.success(request, response, 'Symptom assessment retrieved successfully!', 200, {
                SymptomAssessment : record,
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
                    : `Total ${count} assessment records retrieved successfully!`;
            ResponseHandler.success(request, response, message, 200, { SymptomAssessments: searchResults });
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
                throw new ApiError(404, 'Symptom assessment not found.');
            }
            await this.authorizeOne(request, record.PatientUserId, null);
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update assessment record!');
            }
            ResponseHandler.success(request, response, 'Symptom assessment record updated successfully!', 200, {
                SymptomAssessment : updated,
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
                throw new ApiError(404, 'Symptom assessment not found.');
            }
            await this.authorizeOne(request, record.PatientUserId, null);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Symptom assessment cannot be deleted.');
            }
            ResponseHandler.success(request, response, 'Symptom assessment record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Authorization

    authorizeSearch = async (
        request: express.Request,
        searchFilters: SymptomAssessmentSearchFilters): Promise<SymptomAssessmentSearchFilters> => {

        const currentUser = request.currentUser;

        if (searchFilters.PatientUserId != null) {
            if (searchFilters.PatientUserId !== request.currentUser.UserId) {
                const hasConsent = await PermissionHandler.checkConsent(
                    searchFilters.PatientUserId,
                    currentUser.UserId,
                    request.context
                );
                if (!hasConsent) {
                    throw new ApiError(403, `Unauthorized`);
                }
            }
        }
        else {
            searchFilters.PatientUserId = currentUser.UserId;
        }
        return searchFilters;
    };

    //#endregion
}

import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { DiagnosisService } from '../../../services/clinical/diagnosis.service';
import { UserService } from '../../../services/users/user/user.service';
import { DiagnosisValidator } from './diagnosis.validator';
import { Injector } from '../../../startup/injector';
import { BaseController } from '../../../api/base.controller';
import { DiagnosisSearchFilters } from '../../../domain.types/clinical/diagnosis/diagnosis.search.types';
import { PermissionHandler } from '../../../auth/custom/permission.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class DiagnosisController extends BaseController{

    //#region member variables and constructors

    _service: DiagnosisService = Injector.Container.resolve(DiagnosisService);

    _validator: DiagnosisValidator = new DiagnosisValidator();

    _userService: UserService = Injector.Container.resolve(UserService);

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.create(request);
            await this.authorizeOne(request, domainModel.PatientUserId);
            if (domainModel.PatientUserId != null) {
                const person = await this._userService.getById(domainModel.PatientUserId);
                if (person == null) {
                    throw new ApiError(404, `User with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

            const diagnosis = await this._service.create(domainModel);
            if (diagnosis == null) {
                throw new ApiError(400, 'Cannot create diagnosis!');
            }

            ResponseHandler.success(request, response, 'Diagnosis created successfully!', 201, {
                Diagnosis : diagnosis,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const diagnosis = await this._service.getById(id);
            if (diagnosis == null) {
                throw new ApiError(404, 'Diagnosis record not found.');
            }
            await this.authorizeOne(request, diagnosis.PatientUserId);
            ResponseHandler.success(request, response, 'Diagnosis retrieved successfully!', 200, {
                Diagnosis : diagnosis,
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
                count === 0 ? 'No records found!' : `Total ${count} diagnosis records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Diagnosis : searchResults,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingUser = await this._service.getById(id);
            if (existingUser == null) {
                throw new ApiError(404, 'Diagnosis record not found.');
            }
            await this.authorizeOne(request, existingUser.PatientUserId);
            const updatedDiagnosis = await this._service.update(id, domainModel);
            if (updatedDiagnosis == null) {
                throw new ApiError(400, 'Unable to update diagnosis record!');
            }

            ResponseHandler.success(request, response, 'Diagnosis records updated successfully!', 200, {
                Diagnosis : updatedDiagnosis,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingUser = await this._service.getById(id);
            if (existingUser == null) {
                throw new ApiError(404, 'Diagnosis record not found.');
            }
            await this.authorizeOne(request, existingUser.PatientUserId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Diagnosis record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Diagnosis record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    private authorizeSearch = async (
        request: express.Request,
        searchFilters: DiagnosisSearchFilters): Promise<DiagnosisSearchFilters> => {

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

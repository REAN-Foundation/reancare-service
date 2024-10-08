import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { SymptomService } from '../../../../services/clinical/symptom/symptom.service';
import { Injector } from '../../../../startup/injector';
import { SymptomValidator } from './symptom.validator';
import { PermissionHandler } from '../../../../auth/custom/permission.handler';
import { SymptomSearchFilters } from '../../../../domain.types/clinical/symptom/symptom/symptom.search.types';
import { BaseController } from '../../../../api/base.controller';
import { SymptomDomainModel } from '../../../../domain.types/clinical/symptom/symptom/symptom.domain.model';
import { UserService } from '../../../../services/users/user/user.service';
import { SymptomEvents } from '../symptom.events';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomController extends BaseController {

    //#region member variables and constructors

    _service: SymptomService = Injector.Container.resolve(SymptomService);

    _validator: SymptomValidator = new SymptomValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel: SymptomDomainModel = await this._validator.create(request);
            await this.authorizeUser(request, domainModel.PatientUserId);
            const symptom = await this._service.create(domainModel);
            if (symptom == null) {
                throw new ApiError(400, 'Cannot create symptom!');
            }

            SymptomEvents.onSymptomAdded(request, symptom, 'symptom');

            ResponseHandler.success(request, response, 'Symptom created successfully!', 201, {
                Symptom : symptom,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const symptom = await this._service.getById(id);
            if (symptom == null) {
                throw new ApiError(404, 'Symptom not found.');
            }
            await this.authorizeUser(request, symptom.PatientUserId);
            ResponseHandler.success(request, response, 'Symptom retrieved successfully!', 200, {
                Symptom : symptom,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            let filters: SymptomSearchFilters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} symptom records retrieved successfully!`;
            ResponseHandler.success(request, response, message, 200, { Symptoms: searchResults });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingSymptom = await this._service.getById(id);
            if (existingSymptom == null) {
                throw new ApiError(404, 'Symptom not found.');
            }
            await this.authorizeUser(request, existingSymptom.PatientUserId);
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update symptom record!');
            }

            SymptomEvents.onSymptomUpdated(request, updated, 'symptom');

            ResponseHandler.success(request, response, 'Symptom record updated successfully!', 200, {
                Symptom : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingSymptom = await this._service.getById(id);
            if (existingSymptom == null) {
                throw new ApiError(404, 'Symptom not found.');
            }
            await this.authorizeUser(request, existingSymptom.PatientUserId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Symptom cannot be deleted.');
            }

            SymptomEvents.onSymptomDeleted(request, existingSymptom, 'symptom');
            
            ResponseHandler.success(request, response, 'Symptom record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion
   private authorizeUser = async (request: express.Request, ownerUserId: uuid) => {
       const _userService = Injector.Container.resolve(UserService);
       const user = await _userService.getById(ownerUserId);
       if (!user) {
           throw new ApiError(404, `User with Id ${ownerUserId} not found.`);
       }
       request.resourceOwnerUserId = ownerUserId;
       request.resourceTenantId = user.TenantId;
       await this.authorizeOne(request, ownerUserId, user.TenantId);
   };

    private authorizeSearch = async (
        request: express.Request,
        searchFilters: SymptomSearchFilters): Promise<SymptomSearchFilters> => {

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

}

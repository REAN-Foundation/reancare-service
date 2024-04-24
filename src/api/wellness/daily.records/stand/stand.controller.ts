import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { StandService } from '../../../../services/wellness/daily.records/stand.service';
import { Injector } from '../../../../startup/injector';
import { StandValidator } from './stand.validator';
import { EHRPhysicalActivityService } from '../../../../modules/ehr.analytics/ehr.services/ehr.physical.activity.service';
import { BaseController } from '../../../../api/base.controller';
import { StandSearchFilters } from '../../../../domain.types/wellness/daily.records/stand/stand.search.types';
import { PermissionHandler } from '../../../../auth/custom/permission.handler';
import { UserService } from '../../../../services/users/user/user.service';

///////////////////////////////////////////////////////////////////////////////////////

export class StandController extends BaseController {

    //#region member variables and constructors

    _service: StandService = Injector.Container.resolve(StandService);

    _validator: StandValidator = new StandValidator();

    _ehrPhysicalActivityService: EHRPhysicalActivityService = Injector.Container.resolve(EHRPhysicalActivityService);

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.create(request);
            await this.authorizeUser(request, domainModel.PatientUserId);
            const stand = await this._service.create(domainModel);
            if (stand == null) {
                throw new ApiError(400, 'Cannot create stand record!');
            }

            await this._ehrPhysicalActivityService.addEHRRecordStandForAppNames(stand);

            ResponseHandler.success(request, response, 'Stand record created successfully!', 201, {
                Stand : stand,

            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const stand = await this._service.getById(id);
            if (stand == null) {
                throw new ApiError(404, 'Stand record not found.');
            }
            await this.authorizeUser(request, stand.PatientUserId);
            ResponseHandler.success(request, response, 'Stand record retrieved successfully!', 200, {
                Stand : stand,
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
                    : `Total ${count} stand records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { StandRecords: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingStand = await this._service.getById(id);
            if (existingStand == null) {
                throw new ApiError(404, 'Stand record not found.');
            }
            await this.authorizeUser(request, existingStand.PatientUserId);
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update stand record!');
            }

            await this._ehrPhysicalActivityService.addEHRRecordStandForAppNames(updated);

            ResponseHandler.success(request, response, 'Stand record updated successfully!', 200, {
                Stand : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingStand = await this._service.getById(id);
            if (existingStand == null) {
                throw new ApiError(404, 'Stand record not found.');
            }
            await this.authorizeUser(request, existingStand.PatientUserId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Stand record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Stand record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

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
        searchFilters: StandSearchFilters): Promise<StandSearchFilters> => {

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

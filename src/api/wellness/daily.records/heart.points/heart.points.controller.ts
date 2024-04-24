import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { HeartPointsService } from '../../../../services/wellness/daily.records/heart.points.service';
import { Injector } from '../../../../startup/injector';
import { HeartPointValidator } from './heart.points.validator';
import { BaseController } from '../../../../api/base.controller';
import { HeartPointsSearchFilters } from '../../../../domain.types/wellness/daily.records/heart.points/heart.points.search.types';
import { PermissionHandler } from '../../../../auth/custom/permission.handler';
import { UserService } from '../../../../services/users/user/user.service';

///////////////////////////////////////////////////////////////////////////////////////

export class HeartPointController extends BaseController{

    //#region member variables and constructors

    _validator: HeartPointValidator = new HeartPointValidator();

    _service: HeartPointsService = Injector.Container.resolve(HeartPointsService);

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
            await this.authorizeUser(request, model.PatientUserId);
            const heartPoint = await this._service.create(model);
            if (heartPoint == null) {
                throw new ApiError(400, 'Cannot create record for heart Points!');
            }

            ResponseHandler.success(request, response, 'Heart points record created successfully!', 201, {
                HeartPoints : heartPoint,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const heartPoint = await this._service.getById(id);
            if (heartPoint == null) {
                throw new ApiError(404, 'Heart points record not found.');
            }
            await this.authorizeUser(request, heartPoint.PatientUserId);
            ResponseHandler.success(request, response, 'Heart points record retrieved successfully!', 200, {
                HeartPoints : heartPoint,
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
                    : `Total ${count} heart points records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { HeartPointsRecords: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Heart points record not found.');
            }
            await this.authorizeUser(request, existingRecord.PatientUserId);
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update heart points record!');
            }

            ResponseHandler.success(request, response, 'Heart points record updated successfully!', 200, {
                HeartPoints : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Heart points record not found.');
            }
            await this.authorizeUser(request, existingRecord.PatientUserId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Heart points record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Heart points record deleted successfully!', 200, {
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
        searchFilters: HeartPointsSearchFilters): Promise<HeartPointsSearchFilters> => {

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

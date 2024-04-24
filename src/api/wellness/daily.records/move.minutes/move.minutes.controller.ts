import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { MoveMinutesService } from '../../../../services/wellness/daily.records/move.minutes.service';
import { Injector } from '../../../../startup/injector';
import { MoveMinutesValidator } from './move.minutes.validator';
import { MoveMinutesSearchFilters } from '../../../../domain.types/wellness/daily.records/move.minutes/move.minutes.search.types';
import { PermissionHandler } from '../../../../auth/custom/permission.handler';
import { BaseController } from '../../../../api/base.controller';
import { UserService } from '../../../../services/users/user/user.service';

///////////////////////////////////////////////////////////////////////////////////////

export class MoveMinutesController extends BaseController {

    //#region member variables and constructors

    _validator: MoveMinutesValidator = new MoveMinutesValidator();

    _service: MoveMinutesService = Injector.Container.resolve(MoveMinutesService);

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
            await this.authorizeUser(request, model.PatientUserId);
            const moveMinutes = await this._service.create(model);
            if (moveMinutes == null) {
                throw new ApiError(400, 'Cannot create record for daily move minutes!');
            }

            ResponseHandler.success(request, response, 'Daily move minutes record created successfully!', 201, {
                MoveMinutes : moveMinutes,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const moveMinutes = await this._service.getById(id);
            if (moveMinutes == null) {
                throw new ApiError(404, 'Daily move minutes record not found.');
            }
            await this.authorizeUser(request, moveMinutes.PatientUserId);
            ResponseHandler.success(request, response, 'Daily move minutes record retrieved successfully!', 200, {
                MoveMinutes : moveMinutes,
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
                    : `Total ${count} daily move minutes records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                MoveMinutesRecords : searchResults });

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
                throw new ApiError(404, 'Daily move minutes record not found.');
            }
            await this.authorizeUser(request, existingRecord.PatientUserId);
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update daily move minutes record!');
            }

            ResponseHandler.success(request, response, 'Daily move minutes record updated successfully!', 200, {
                MoveMinutes : updated,
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
                throw new ApiError(404, 'Daily move minutes record not found.');
            }
            await this.authorizeUser(request, existingRecord.PatientUserId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Daily move minutes record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Daily move minutes record deleted successfully!', 200, {
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
        searchFilters: MoveMinutesSearchFilters): Promise<MoveMinutesSearchFilters> => {

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

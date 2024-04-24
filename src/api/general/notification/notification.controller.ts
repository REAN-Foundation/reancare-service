import express from 'express';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { NotificationService } from '../../../services/general/notification.service';
import { NotificationValidator } from './notification.validator';
import { Injector } from '../../../startup/injector';
import { BaseController } from '../../../api/base.controller';
import {
    NotificationCreateModel,
    NotificationDto,
    NotificationSearchFilters
} from '../../../domain.types/general/notification/notification.types';
import { Roles } from '../../../domain.types/role/role.types';

///////////////////////////////////////////////////////////////////////////////////////

export class NotificationController extends BaseController {

    //#region member variables and constructors

    _service: NotificationService = Injector.Container.resolve(NotificationService);

    _validator: NotificationValidator = new NotificationValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: NotificationCreateModel = await this._validator.create(request);
            await this.authorize(request, model);
            const notification = await this._service.create(model);
            if (notification == null) {
                throw new ApiError(400, 'Could not create a notification!');
            }
            ResponseHandler.success(request, response, 'Notification created successfully!', 201, {
                Notification : notification,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record: NotificationDto = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Notification not found.');
            }
            await this.authorize(request, record);
            ResponseHandler.success(request, response, 'Notification retrieved successfully!', 200, {
                Notification : record,
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
                    : `Total ${count} notifications retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                NotificationRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const notification = await this._service.getById(id);
            if (notification == null) {
                throw new ApiError(404, 'Notification not found.');
            }
            await this.authorize(request, notification);
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update a notification!');
            }

            ResponseHandler.success(request, response, 'Notification updated successfully!', 200, {
                Notification : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const notification = await this._service.getById(id);
            if (notification == null) {
                throw new ApiError(404, 'Notification record not found.');
            }
            await this.authorize(request, notification);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Notification can not be deleted.');
            }

            ResponseHandler.success(request, response, 'Notification deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    sendToUser = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const notification = await this._service.getById(id);
            if (notification == null) {
                throw new ApiError(404, 'Notification not found.');
            }
            await this.authorize(request, notification);

            const created = await this._service.sendToUser(id, userId);
            if (created == null) {
                throw new ApiError(400, 'Could not create a notification for the user!');
            }

            await this.sendNotifications(notification);

            ResponseHandler.success(request, response, 'Notification created successfully!', 201, {
                Notification : notification,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    send = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const notification = await this._service.getById(id);
            if (notification == null) {
                throw new ApiError(404, 'Notification not found.');
            }
            await this.authorize(request, notification);

            await this.sendNotifications(notification);

            ResponseHandler.success(request, response, 'Notification sent successfully!', 200, {
                Notification : notification,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    markAsRead = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const notification = await this._service.getById(id);
            if (notification == null) {
                throw new ApiError(404, 'Notification not found.');
            }
            const userNotification = await this._service.getUserNotification(id, userId);
            if (userNotification == null) {
                throw new ApiError(404, 'User notification not found.');
            }
            const updated = await this._service.markAsRead(id, userId);
            if (updated == null) {
                throw new ApiError(400, 'Marked a notification as read!');
            }
            ResponseHandler.success(request, response, 'Notification updated successfully!', 200, {
                Notification : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Authorization

    authorize = async (
        request: express.Request,
        model: NotificationCreateModel | NotificationDto)
        : Promise<void> => {

        const tenantId = request.currentUser.TenantId;
        const userRole = request.currentUser.CurrentRole;
        if (model.TenantId !== null && model.TenantId !== undefined) {
            if (model.TenantId !== tenantId) {
                // Then only system users can create notifications for other tenants
                if (userRole !== Roles.SystemAdmin &&
                    userRole !== Roles.SystemUser) {
                    throw new ApiError(403, 'Forbidden');
                }
            }
            else if (userRole !== Roles.TenantAdmin &&
                     userRole !== Roles.TenantUser) {
                //If thenant is same, then only tenant users can create notifications
                throw new ApiError(403, 'Forbidden');
            }
        }
    };

    authorizeSearch = async (
        request: express.Request,
        searchFilters: NotificationSearchFilters): Promise<NotificationSearchFilters> => {

        const tenantId = request.currentUser.TenantId;
        const userRole = request.currentUser.CurrentRole;

        if (searchFilters.TenantId != null) {
            if (searchFilters.TenantId !== tenantId) {
                // Then only system users can search notifications for other tenants
                if (userRole !== Roles.SystemAdmin &&
                    userRole !== Roles.SystemUser) {
                    throw new ApiError(403, 'Forbidden');
                }
            }
        }
        else if (userRole !== Roles.SystemAdmin &&
                 userRole !== Roles.SystemUser) {
            searchFilters.TenantId = tenantId;

        }
        return searchFilters;
    };

    //#endregion

    sendNotifications = async (notification: NotificationDto) => {
        // TODO: Send notification to user through notification service
        //Target
        //Channel
        //Type
    };

}

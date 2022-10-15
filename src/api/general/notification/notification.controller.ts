import express from 'express';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { NotificationService } from '../../../services/general/notification.service';
import { Loader } from '../../../startup/loader';
import { NotificationValidator } from './notification.validator';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class NotificationController extends BaseController {

    //#region member variables and constructors

    _service: NotificationService = null;

    _validator: NotificationValidator = new NotificationValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(NotificationService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('Notification.Create', request, response);

            const model = await this._validator.create(request);
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
            
            await this.setContext('Notification.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const notification = await this._service.getById(id);
            if (notification == null) {
                throw new ApiError(404, 'Notification not found.');
            }

            ResponseHandler.success(request, response, 'Notification retrieved successfully!', 200, {
                Notification : notification,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    markAsRead = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('Notification.MarkAsRead', request, response);

            const domainModel = await this._validator.markAsRead(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Notification not found.');
            }

            const updated = await this._service.markAsRead(domainModel.id, domainModel);
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

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('Notification.Search', request, response);
            const filters = await this._validator.search(request);
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
            
            await this.setContext('Notification.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Notification not found.');
            }

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
            
            await this.setContext('Notification.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Notification record not found.');
            }

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

}

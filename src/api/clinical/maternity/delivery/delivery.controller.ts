import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { DeliveryService } from '../../../../services/clinical/maternity/delivery.service';
import { Injector } from '../../../../startup/injector';
import { DeliveryValidator } from './delivery.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class DeliveryController extends BaseController {

    //#region member variables and constructors

    _service: DeliveryService = Injector.Container.resolve(DeliveryService);

    _validator: DeliveryValidator = new DeliveryValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.create(request);
            const delivery = await this._service.create(model);
            if (delivery == null) {
                throw new ApiError(400, 'Cannot create record for delivery!');
            }

            ResponseHandler.success(request, response, 'Delivery record created successfully!', 201, {
                Delivery: delivery,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const delivery = await this._service.getById(id);
            if (delivery == null) {
                throw new ApiError(404, 'Delivery record not found.');
            }

            ResponseHandler.success(request, response, 'Delivery record retrieved successfully!', 200, {
                Delivery: delivery,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No delivery records found!'
                    : `Total ${count} delivery records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Deliveries: searchResults
            });
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
                throw new ApiError(404, 'Delivery record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update delivery record!');
            }

            ResponseHandler.success(request, response, 'Delivery record updated successfully!', 200, {
                Delivery: updated,
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
                throw new ApiError(404, 'Delivery record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Delivery record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Delivery record deleted successfully!', 200, {
                Deleted: true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

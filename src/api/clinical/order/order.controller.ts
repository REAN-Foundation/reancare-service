import express from 'express';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { OrderService } from '../../../services/clinical/order.service';
import { Loader } from '../../../startup/loader';
import { OrderValidator } from './order.validator';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class OrderController extends BaseController{

    //#region member variables and constructors

    _service: OrderService = null;

    _validator: OrderValidator = new OrderValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(OrderService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Order.Create', request, response);

            const model = await this._validator.create(request);
            const order = await this._service.create(model);
            if (order == null) {
                throw new ApiError(400, 'Cannot create record for order!');
            }

            ResponseHandler.success(request, response, 'Order record created successfully!', 201, {
                Order : order,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Order.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const order = await this._service.getById(id);
            if (order == null) {
                throw new ApiError(404, 'Order record not found.');
            }

            ResponseHandler.success(request, response, 'Order record retrieved successfully!', 200, {
                Order : order,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Order.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} order records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                OrderRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Order.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Order record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update order record!');
            }

            ResponseHandler.success(request, response, 'Order record updated successfully!', 200, {
                Order : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Order.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Order record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Order record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Order record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

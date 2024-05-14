import express from 'express';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { OrderService } from '../../../services/clinical/order.service';
import { OrderValidator } from './order.validator';
import { Injector } from '../../../startup/injector';
import { BaseController } from '../../../api/base.controller';
import { PermissionHandler } from '../../../auth/custom/permission.handler';
import { OrderSearchFilters } from '../../../domain.types/clinical/order/order.search.types';
import { OrderDomainModel } from '../../../domain.types/clinical/order/order.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class OrderController extends BaseController {

    //#region member variables and constructors

    _service: OrderService = Injector.Container.resolve(OrderService);

    _validator: OrderValidator = new OrderValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model: OrderDomainModel = await this._validator.create(request);
            await this.authorizeOne(request, model.PatientUserId);
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

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const order = await this._service.getById(id);
            if (order == null) {
                throw new ApiError(404, 'Order record not found.');
            }
            await this.authorizeOne(request, order.PatientUserId);
            ResponseHandler.success(request, response, 'Order record retrieved successfully!', 200, {
                Order : order,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            let filters: OrderSearchFilters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
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

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Order record not found.');
            }
            await this.authorizeOne(request, existingRecord.PatientUserId);
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

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Order record not found.');
            }
            await this.authorizeOne(request, existingRecord.PatientUserId);
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
    private authorizeSearch = async (
        request: express.Request,
        searchFilters: OrderSearchFilters): Promise<OrderSearchFilters> => {

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

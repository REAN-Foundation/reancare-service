import express from 'express';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { OrderService } from '../../../services/clinical/order.service';
import { PatientService } from '../../../services/patient/patient.service';
import { PersonService } from '../../../services/person.service';
import { Loader } from '../../../startup/loader';
import { OrderValidator } from '../../validators/clinical/order.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class OrderController {

    //#region member variables and constructors

    _service: OrderService = null;

    _authorizer: Authorizer = null;

    _personService: PersonService = null;

    _patientService: PatientService = null;

    constructor() {
        this._service = Loader.container.resolve(OrderService);
        this._personService = Loader.container.resolve(PersonService);
        this._patientService = Loader.container.resolve(PatientService);

        this._authorizer = Loader.authorizer;

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Order.Create';

            const orderDomainModel = await OrderValidator.create(request);

            const Order = await this._service.create(orderDomainModel);
            if (Order == null) {
                throw new ApiError(400, 'Cannot create record for order!');
            }

            ResponseHandler.success(request, response, 'Order record created successfully!', 201, {
                Order : Order,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Order.GetById';
            
            await this._authorizer.authorize(request, response);

            const id: string = await OrderValidator.getById(request);

            const Order = await this._service.getById(id);
            if (Order == null) {
                throw new ApiError(404, ' Order record not found.');
            }

            ResponseHandler.success(request, response, 'Order record retrieved successfully!', 200, {
                Order : Order,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Order.Search';
            await this._authorizer.authorize(request, response);

            const filters = await OrderValidator.search(request);

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
            request.context = 'Order.Update';

            await this._authorizer.authorize(request, response);

            const domainModel = await OrderValidator.update(request);

            const id: string = await OrderValidator.getById(request);
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
            request.context = 'Order.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await OrderValidator.getById(request);
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

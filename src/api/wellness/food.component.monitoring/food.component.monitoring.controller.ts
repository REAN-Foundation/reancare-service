import express from 'express';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { FoodComponentMonitoringService } from '../../../services/wellness/food.component.monitoring/food.component.monitoring.service';
import { Loader } from '../../../startup/loader';
import { FoodComponentMonitoringValidator } from './food.component.monitoring.validator';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class FoodComponentMonitoringController extends BaseController {

    //#region member variables and constructors

    _service: FoodComponentMonitoringService = null;

    _validator: FoodComponentMonitoringValidator = new FoodComponentMonitoringValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(FoodComponentMonitoringService);

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('FoodComponentMonitoring.Create', request, response);

            const model = await this._validator.create(request);

            const foodComponentMonitoring = await this._service.create(model);
            if (foodComponentMonitoring == null) {
                throw new ApiError(400, 'Cannot create record for food component monitoring!');
            }

            ResponseHandler.success(request, response, 'Food component monitoring record created successfully!', 201, {
                FoodComponentMonitoring : foodComponentMonitoring,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('FoodComponentMonitoring.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const foodComponentMonitoring = await this._service.getById(id);
            if (foodComponentMonitoring == null) {
                throw new ApiError(404, 'Food component monitoring record not found.');
            }

            ResponseHandler.success(request, response, 'Food component monitoring record retrieved successfully!', 200, {
                FoodComponentMonitoring : foodComponentMonitoring,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('FoodComponentMonitoring.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} food component monitoring records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                FoodComponentMonitoringRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('FoodComponentMonitoring.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Food component monitoring record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update food component monitoring record!');
            }

            ResponseHandler.success(request, response, 'Food component monitoring record updated successfully!', 200, {
                FoodComponentMonitoring : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('FoodComponentMonitoring.Delete', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Food component monitoring record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Food component monitoring record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Food component monitoring record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

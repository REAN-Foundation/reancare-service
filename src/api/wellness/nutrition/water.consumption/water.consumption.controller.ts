import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { WaterConsumptionService } from '../../../../services/wellness/nutrition/water.consumption.service';
import { Loader } from '../../../../startup/loader';
import { WaterConsumptionValidator } from './water.consumption.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class WaterConsumptionController extends BaseController {

    //#region member variables and constructors

    _service: WaterConsumptionService = null;

    _validator: WaterConsumptionValidator = new WaterConsumptionValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(WaterConsumptionService);

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Nutrition.WaterConsumption.Create', request, response);

            const model = await this._validator.create(request);

            const WaterConsumption = await this._service.create(model);
            if (WaterConsumption == null) {
                throw new ApiError(400, 'Cannot create record for water consumption!');
            }

            ResponseHandler.success(request, response, 'Water consumption record created successfully!', 201, {
                WaterConsumption : WaterConsumption,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Nutrition.WaterConsumption.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const WaterConsumption = await this._service.getById(id);
            if (WaterConsumption == null) {
                throw new ApiError(404, ' Water consumption record not found.');
            }

            ResponseHandler.success(request, response, 'Water consumption record retrieved successfully!', 200, {
                WaterConsumption : WaterConsumption,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Nutrition.WaterConsumption.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} water consumption records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                WaterConsumptionRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Nutrition.WaterConsumption.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Water consumption record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update waterConsumption record!');
            }

            ResponseHandler.success(request, response, 'Water consumption record updated successfully!', 200, {
                WaterConsumption : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Nutrition.WaterConsumption.Delete', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Water consumption record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Water consumption record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Water consumption record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

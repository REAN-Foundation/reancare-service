import express from 'express';
import { Authorizer } from '../../../../auth/authorizer';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { WaterConsumptionService } from '../../../../services/wellness/nutrition/water.consumption.service';
import { Loader } from '../../../../startup/loader';
import { WaterConsumptionValidator } from '../../../validators/wellness/nutrition/water.consumption.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class WaterConsumptionController {

    //#region member variables and constructors

    _service: WaterConsumptionService = null;

    _authorizer: Authorizer = null;

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(WaterConsumptionService);
        this._authorizer = Loader.authorizer;

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Nutrition.WaterConsumption.Create';

            const waterConsumptionDomainModel = await WaterConsumptionValidator.create(request);

            const WaterConsumption = await this._service.create(waterConsumptionDomainModel);
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
            request.context = 'Nutrition.WaterConsumption.GetById';
            
            await this._authorizer.authorize(request, response);

            const id: string = await WaterConsumptionValidator.getById(request);

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
            request.context = 'Nutrition.WaterConsumption.Search';
            await this._authorizer.authorize(request, response);

            const filters = await WaterConsumptionValidator.search(request);

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
            request.context = 'Nutrition.WaterConsumption.Update';

            await this._authorizer.authorize(request, response);

            const domainModel = await WaterConsumptionValidator.update(request);

            const id: string = await WaterConsumptionValidator.getById(request);
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
            request.context = 'Nutrition.WaterConsumption.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await WaterConsumptionValidator.getById(request);
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

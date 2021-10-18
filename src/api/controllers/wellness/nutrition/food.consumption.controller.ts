import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { FoodConsumptionService } from '../../../../services/wellness/nutrition/food.consumption.service';
import { Loader } from '../../../../startup/loader';
import { FoodConsumptionValidator } from '../../../validators/wellness/nutrition/food.consumption.validator';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class FoodConsumptionController extends BaseController {

    //#region member variables and constructors

    _service: FoodConsumptionService = null;

    constructor() {
        super();
        this._service = Loader.container.resolve(FoodConsumptionService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            this.setContext('Nutrition.FoodConsumption.Create', request, response);

            const foodConsumptionDomainModel = await FoodConsumptionValidator.create(request);
            const foodConsumption = await this._service.create(foodConsumptionDomainModel);
            if (foodConsumption == null) {
                throw new ApiError(400, 'Cannot create record for food consumption!');
            }

            ResponseHandler.success(request, response, 'Food consumption record created successfully!', 201, {
                FoodConsumption : foodConsumption,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            this.setContext('Nutrition.FoodConsumption.GetById', request, response);

            const id: string = await FoodConsumptionValidator.getById(request);
            const foodConsumption = await this._service.getById(id);
            if (foodConsumption == null) {
                throw new ApiError(404, 'Food consumption record not found.');
            }

            ResponseHandler.success(request, response, 'Food consumption record retrieved successfully!', 200, {
                FoodConsumption : foodConsumption,
            });
            
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByEvent = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            this.setContext('Nutrition.FoodConsumption.GetByEvent', request, response);

            const event: string = await FoodConsumptionValidator.getByEvent(request);
            const foodConsumptionEvent = await this._service.getByEvent(event, request.params.patientUserId);
            if (foodConsumptionEvent == null) {
                throw new ApiError(404, 'Food consumption record not found.');
            }

            ResponseHandler.success(request, response, 'Food consumption records retrieved successfully!', 200, {
                FoodConsumptionEvent : foodConsumptionEvent,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getForDay = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            this.setContext('Nutrition.FoodConsumption.GetForDay', request, response);

            const date = await FoodConsumptionValidator.getForDay(request);

            const foodConsumptionForDay = await this._service.getForDay(date, request.params.patientUserId);
            if (foodConsumptionForDay == null) {
                throw new ApiError(404, 'Food consumption record not found.');
            }

            ResponseHandler.success(request, response, 'Food consumption record retrieved successfully!', 200, {
                FoodConsumptionForDay : foodConsumptionForDay,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            this.setContext('Nutrition.FoodConsumption.Search', request, response);

            const filters = await FoodConsumptionValidator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} food consumption records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                FoodConsumptionRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            this.setContext('Nutrition.FoodConsumption.Update', request, response);

            const domainModel = await FoodConsumptionValidator.update(request);

            const id: string = await FoodConsumptionValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Food consumption record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update food consumption record!');
            }

            ResponseHandler.success(request, response, 'Food consumption record updated successfully!', 200, {
                FoodConsumption : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            this.setContext('Nutrition.FoodConsumption.Delete', request, response);

            const id: string = await FoodConsumptionValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Food consumption record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Food consumption record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Food consumption record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

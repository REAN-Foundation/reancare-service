import express from 'express';
import { ResponseHandler } from '../../../../common/response.handler';
import { Loader } from '../../../../startup/loader';
import { ApiError } from '../../../../common/api.error';
import { FoodConsumptionService } from '../../../../services/wellness/nutrition/food.consumption.service';
import { Authorizer } from '../../../../auth/authorizer';
import { FoodConsumptionValidator } from '../../../validators/wellness/nutrition/food.consumption.validator';
import { Helper } from '../../../../common/helper';

///////////////////////////////////////////////////////////////////////////////////////

export class FoodConsumptionController {

    //#region member variables and constructors

    _service: FoodConsumptionService = null;

    _authorizer: Authorizer = null;

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(FoodConsumptionService);
        this._authorizer = Loader.authorizer;

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Nutrition.FoodConsumption.Create';

            const foodConsumptionDomainModel = await FoodConsumptionValidator.create(request);

            const FoodConsumption = await this._service.create(foodConsumptionDomainModel);
            if (FoodConsumption == null) {
                throw new ApiError(400, 'Cannot create record for food consumption!');
            }

            ResponseHandler.success(request, response, 'Food consumption record created successfully!', 201, {
                FoodConsumption : FoodConsumption,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Nutrition.FoodConsumption.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await FoodConsumptionValidator.getById(request);

            const FoodConsumption = await this._service.getById(id);
            if (FoodConsumption == null) {
                throw new ApiError(404, 'Food consumption record not found.');
            }

            ResponseHandler.success(request, response, 'Food consumption record retrieved successfully!', 200, {
                FoodConsumption : FoodConsumption,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByEvent = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Nutrition.FoodConsumption.GetByEvent';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const event: string = await FoodConsumptionValidator.getByEvent(request);

            const FoodConsumptionEvent = await this._service.getByEvent(event, request.resourceOwnerUserId);
            if (FoodConsumptionEvent == null) {
                throw new ApiError(404, 'Food consumption record not found.');
            }

            ResponseHandler.success(request, response, 'Food consumption records retrieved successfully!', 200, {
                FoodConsumptionEvent : FoodConsumptionEvent,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getForDay = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Nutrition.FoodConsumption.GetForDay';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const date = await FoodConsumptionValidator.getForDay(request);

            const FoodConsumptionForDay = await this._service.getForDay(date, request.resourceOwnerUserId);
            if (FoodConsumptionForDay == null) {
                throw new ApiError(404, 'Food consumption record not found.');
            }

            ResponseHandler.success(request, response, 'Food consumption record retrieved successfully!', 200, {
                FoodConsumptionForDay : FoodConsumptionForDay,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Nutrition.FoodConsumption.Search';
            await this._authorizer.authorize(request, response);

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
            request.context = 'Nutrition.FoodConsumption.Update';

            await this._authorizer.authorize(request, response);

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
            request.context = 'Nutrition.FoodConsumption.Delete';
            await this._authorizer.authorize(request, response);

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

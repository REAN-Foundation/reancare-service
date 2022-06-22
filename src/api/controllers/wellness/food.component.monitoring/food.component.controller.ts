import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { FoodComponentService } from '../../../../services/wellness/food.component.monitoring/food.component.service';
import { Loader } from '../../../../startup/loader';
import { FoodComponentValidator } from '../../../validators/wellness/food.component.monitoring/food.component.validator';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class FoodComponentController extends BaseController {

    //#region member variables and constructors

    _service: FoodComponentService = null;

    _validator: FoodComponentValidator = new FoodComponentValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(FoodComponentService);
    
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('FoodComponent.Create', request, response);

            const model = await this._validator.create(request);

            const foodComponent = await this._service.create(model);
            if (foodComponent == null) {
                throw new ApiError(400, 'Cannot create record for food component monitoring!');
            }

            ResponseHandler.success(request, response, 'Food component monitoring record created successfully!', 201, {
                FoodComponent : foodComponent,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('FoodComponent.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const foodComponent = await this._service.getById(id);
            if (foodComponent == null) {
                throw new ApiError(404, 'Food component monitoring record not found.');
            }

            ResponseHandler.success(request, response, 'Food component monitoring record retrieved successfully!', 200, {
                FoodComponent : foodComponent,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('FoodComponent.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} food component monitoring records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                FoodComponentRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('FoodComponent.Update', request, response);

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
                FoodComponent : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('FoodComponent.Delete', request, response);
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

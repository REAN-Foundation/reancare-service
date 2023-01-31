import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { CalorieBalanceService } from '../../../../services/wellness/daily.records/calorie.balance.service';
import { Loader } from '../../../../startup/loader';
import { CalorieBalanceValidator } from './calorie.balance.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class CalorieBalanceController extends BaseController{

    //#region member variables and constructors

    _service: CalorieBalanceService = null;

    _validator: CalorieBalanceValidator = new CalorieBalanceValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(CalorieBalanceService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyRecords.CalorieBalance.Create', request, response);

            const domainModel = await this._validator.create(request);

            const calorieBalance = await this._service.create(domainModel);
            if (calorieBalance == null) {
                throw new ApiError(400, 'Cannot create calorie balance record!');
            }

            ResponseHandler.success(request, response, 'Calorie balance record created successfully!', 201, {
                CalorieBalance : calorieBalance,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyRecords.CalorieBalance.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const calorieBalance = await this._service.getById(id);
            if (calorieBalance == null) {
                throw new ApiError(404, 'Calorie balance record not found.');
            }

            ResponseHandler.success(request, response, 'Calorie balance record retrieved successfully!', 200, {
                CalorieBalance : calorieBalance,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyRecords.CalorieBalance.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} calorie balance records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { CalorieBalanceRecords: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyRecords.CalorieBalance.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Calorie balance record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update calorie balance record!');
            }

            ResponseHandler.success(request, response, 'Calorie balance record updated successfully!', 200, {
                CalorieBalance : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyRecords.CalorieBalance.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Calorie balance record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Calorie balance record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Calorie balance record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

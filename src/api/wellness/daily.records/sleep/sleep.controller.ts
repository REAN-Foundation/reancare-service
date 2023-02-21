import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { SleepService } from '../../../../services/wellness/daily.records/sleep.service';
import { Loader } from '../../../../startup/loader';
import { SleepValidator } from './sleep.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class SleepController extends BaseController{

    //#region member variables and constructors

    _service: SleepService = null;

    _validator: SleepValidator = new SleepValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(SleepService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyRecords.Sleep.Create', request, response);

            const model = await this._validator.create(request);
            const recordDate = request.body.RecordDate;
        
            var existingRecord = await this._service.getByRecordDate(recordDate);
            if (existingRecord !== null) {
                var sleep = await this._service.update(existingRecord.id, model);
            } else {
                var sleep = await this._service.create(model);
            }
            if (sleep == null) {
                throw new ApiError(400, 'Cannot create record for sleep!');
            }

            ResponseHandler.success(request, response, 'Sleep record created successfully!', 201, {
                SleepRecord : sleep,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyRecords.Sleep.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const sleepRecord = await this._service.getById(id);
            if (sleepRecord == null) {
                throw new ApiError(404, 'Sleep record not found.');
            }

            ResponseHandler.success(request, response, 'Sleep record retrieved successfully!', 200, {
                SleepRecord : sleepRecord,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyRecords.Sleep.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} sleep records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { SleepRecords: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyRecords.Sleep.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Sleep record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update sleep record!');
            }

            ResponseHandler.success(request, response, 'Sleep record updated successfully!', 200, {
                SleepRecord : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyRecords.Sleep.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Sleep record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Sleep record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Sleep record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

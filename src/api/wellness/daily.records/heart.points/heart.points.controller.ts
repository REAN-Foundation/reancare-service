import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { HeartPointsService } from '../../../../services/wellness/daily.records/heart.points.service';
import { Loader } from '../../../../startup/loader';
import { HeartPointValidator } from './heart.points.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class HeartPointController extends BaseController{

    //#region member variables and constructors

    _service: HeartPointsService = null;

    _validator: HeartPointValidator = new HeartPointValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(HeartPointsService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyRecords.HeartPoints.Create', request, response);

            const model = await this._validator.create(request);
            const heartPoint = await this._service.create(model);
            if (heartPoint == null) {
                throw new ApiError(400, 'Cannot create record for heart Points!');
            }

            ResponseHandler.success(request, response, 'Heart points record created successfully!', 201, {
                HeartPoints : heartPoint,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyRecords.HeartPoints.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const heartPoint = await this._service.getById(id);
            if (heartPoint == null) {
                throw new ApiError(404, 'Heart points record not found.');
            }

            ResponseHandler.success(request, response, 'Heart points record retrieved successfully!', 200, {
                HeartPoints : heartPoint,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyRecords.HeartPoints.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} heart points records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { HeartPointsRecords: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyRecords.HeartPoints.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Heart points record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update heart points record!');
            }

            ResponseHandler.success(request, response, 'Heart points record updated successfully!', 200, {
                HeartPoints : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyRecords.HeartPoints.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Heart points record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Heart points record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Heart points record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

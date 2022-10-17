import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { StandService } from '../../../../services/wellness/daily.records/stand.service';
import { Loader } from '../../../../startup/loader';
import { StandValidator } from './stand.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class StandController extends BaseController {

    //#region member variables and constructors

    _service: StandService = null;

    _validator: StandValidator = new StandValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(StandService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('DailyRecords.Stand.Create', request, response);

            const domainModel = await this._validator.create(request);

            const stand = await this._service.create(domainModel);
            if (stand == null) {
                throw new ApiError(400, 'Cannot create stand record!');
            }

            ResponseHandler.success(request, response, 'Stand record created successfully!', 201, {
                Stand : stand,

            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('DailyRecords.Stand.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const stand = await this._service.getById(id);
            if (stand == null) {
                throw new ApiError(404, 'Stand record not found.');
            }

            ResponseHandler.success(request, response, 'Stand record retrieved successfully!', 200, {
                Stand : stand,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('DailyRecords.Stand.Search', request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} stand records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { StandRecords: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('DailyRecords.Stand.Update', request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingStand = await this._service.getById(id);
            if (existingStand == null) {
                throw new ApiError(404, 'Stand record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update stand record!');
            }

            ResponseHandler.success(request, response, 'Stand record updated successfully!', 200, {
                Stand : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('DailyRecords.Stand.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingStand = await this._service.getById(id);
            if (existingStand == null) {
                throw new ApiError(404, 'Stand record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Stand record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Stand record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

import express, { application } from 'express';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { BaseController } from '../../base.controller';
import * as path from 'path';
import { CustomQueryService } from '../../../services/statistics/custom.query.service';
import { CustomQueryValidator } from './custom.query.validator';
import { ApiError } from '../../../common/api.error';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class CustomQueryController extends BaseController {

    //#region member variables and constructors
    _service: CustomQueryService = null;

    _validator = new CustomQueryValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(CustomQueryService);
    }

    executeQuery = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('CustomQuery.ExecuteQuery', request, response, false);
            const model = await this._validator.validateQuery(request);
            const queryResponse = await this._service.executeQuery(model);
            const message = 'Query response retrieved successfully!';
            if (model.Format === 'CSV' || model.Format === 'JSON'){
                const filePath = queryResponse.split('\\');
                const fileName = filePath[filePath.length - 1];
                response.setHeader('Content-disposition', 'attachment; filename=' + fileName);
                response.sendFile(path.resolve(queryResponse));
            }
            else {
                ResponseHandler.success(request, response,message, 200, {
                    Response : queryResponse });
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('CustomQuery.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const query = await this._service.getById(id);
            if (query == null) {
                throw new ApiError(404, 'Query not found.');
            }

            ResponseHandler.success(request, response, 'Query retrieved successfully!', 200, {
                Query : query,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('CustomQuery.Search', request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} queries retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Queries : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('CustomQuery.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Query not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update Query!');
            }

            const message = 'Query response retrieved successfully!';
            if (domainModel.Format === 'CSV' || domainModel.Format === 'JSON'){
                const filePath = updated.split('\\');
                const fileName = filePath[filePath.length - 1];
                response.setHeader('Content-disposition', 'attachment; filename=' + fileName);
                response.sendFile(path.resolve(updated));
            }
            else {
                ResponseHandler.success(request, response,message, 200, {
                    Response : updated });
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('CustomQuery.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Query not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Query cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Query deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}

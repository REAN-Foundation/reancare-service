import express from 'express';
import { ApiClientService } from '../../services/api.client.service';
import { ResponseHandler } from '../../common/response.handler';
import { Loader } from '../../startup/loader';
import { ApiClientValidator } from '../validators/api.client.validator';
import { ApiError } from '../../common/api.error';
import { BaseController } from './base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class ApiClientController extends BaseController {

    //#region member variables and constructors

    _service: ApiClientService = null;

    _validator: ApiClientValidator = new ApiClientValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(ApiClientService);
    }

    //#endregion

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Client.Create', request, response);

            const clientDomainModel = await this._validator.create(request);

            const client = await this._service.create(clientDomainModel);
            if (client == null) {
                throw new ApiError(400, 'Unable to create client.');
            }
            ResponseHandler.success(request, response, 'Api client added successfully!', 201, {
                Client : client,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Client.GetById', request, response);

            const id: string = await this._validator.getParamUuid(request, 'id');

            const client = await this._service.getById(id);
            if (client == null) {
                throw new ApiError(404, 'Client not found.');
            }
            ResponseHandler.success(request, response, 'Api client retrieved successfully!', 200, {
                Client : client,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Client.Update', request, response);
            const domainModel = await this._validator.update(request);
            const id: string = await this._validator.getParamUuid(request, 'id');
            const client = await this._service.getById(id);
            if (client == null) {
                throw new ApiError(404, 'Api client not found.');
            }
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update Api client record!');
            }
            ResponseHandler.success(request, response, 'Api client updated successfully!', 200, {
                Client : client,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Client.Delete', request, response);

            const id: string = await this._validator.getParamUuid(request, 'id');
            await this._service.delete(id);
            ResponseHandler.success(request, response, 'Api client deleted successfully!', 200, null);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getCurrentApiKey = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Client.GetApiKey', request, response);

            //await this._authorizer.authorize(request, response);

            const verificationModel = await this._validator.getOrRenewApiKey(request);

            const apiKeyDto = await this._service.getApiKey(verificationModel);
            if (apiKeyDto == null) {
                throw new ApiError(400, 'Unable to retrieve client api key.');
            }
            ResponseHandler.success(request, response, 'Client api keys retrieved successfully!', 200, {
                ApiKeyDetails : apiKeyDto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    renewApiKey = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Client.RenewApiKey', request, response);

            //await this._authorizer.authorize(request, response);

            const verificationModel = await this._validator.getOrRenewApiKey(request);
            if (verificationModel.ValidFrom == null) {
                verificationModel.ValidFrom = new Date();
            }
            if (verificationModel.ValidTill == null) {
                const d = new Date();
                d.setFullYear(d.getFullYear() + 1);
                verificationModel.ValidTill = d;
            }
            const apiKeyDto = await this._service.renewApiKey(verificationModel);
            if (apiKeyDto == null) {
                throw new ApiError(400, 'Unable to renew client api key.');
            }
            ResponseHandler.success(request, response, 'Client api keys renewed successfully!', 200, {
                ApiKeyDetails : apiKeyDto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}

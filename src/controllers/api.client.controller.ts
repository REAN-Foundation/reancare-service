import express from 'express';

import { ApiClientService } from '../services/api.client.service';
import { ResponseHandler } from '../common/response.handler';
import { Loader } from '../startup/loader';
import { Authorizer } from '../auth/authorizer';
import { ApiClientDomainModel, ApiClientVerificationDomainModel } from '../data/domain.types/api.client.domain.types';
import { ApiClientInputValidator } from './input.validators/api.client.input.validator';
import { ApiError } from '../common/api.error';

///////////////////////////////////////////////////////////////////////////////////////

export class ApiClientController {
    //#region member variables and constructors

    _service: ApiClientService = null;
    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(ApiClientService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    create = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Client.Create';
            this._authorizer.authorize(request, response);

            var clientDomainModel = await ApiClientInputValidator.create(request, response);
            const client = await this._service.create(clientDomainModel);
            if (client == null) {
                throw new ApiError(400, 'Unable to create client.');
            }
            ResponseHandler.success(request, response, 'User created successfully!', 200, {
                Client: client,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Client.GetById';
            this._authorizer.authorize(request, response);

            var id: string = await ApiClientInputValidator.getById(request, response);

            const client = await this._service.getById(id);
            if (client == null) {
                throw new ApiError(404, 'Client not found.');
            }
            ResponseHandler.success(request, response, 'Client retrieved successfully!', 200, {
                Client: client,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Client.Update';
            this._authorizer.authorize(request, response);

            var id: string = await ApiClientInputValidator.getById(request, response);
            var domainModel = await ApiClientInputValidator.update(request, response);
            const client = await this._service.update(id, domainModel);
            if (client == null) {
                throw new ApiError(404, 'Client not found.');
            }
            ResponseHandler.success(request, response, 'Client updated successfully!', 200, {
                Client: client,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Client.Delete';
            this._authorizer.authorize(request, response);
            var id: string = await ApiClientInputValidator.getById(request, response);
            await this._service.delete(id);
            ResponseHandler.success(request, response, 'Client deleted successfully!', 200, null);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getApiKey = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Client.GetApiKey';
            var verificationModel = await ApiClientInputValidator.getOrRenewApiKey(request, response);

            const apiKeyDto = await this._service.getApiKey(verificationModel);
            if (apiKeyDto == null) {
                throw new ApiError(400, 'Unable to retrieve client api key.');
            }
            ResponseHandler.success(request, response, 'Client api keys retrieved successfully!', 200, {
                ApiKeyDetails: apiKeyDto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    renewApiKey = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Client.RenewApiKey';
            var verificationModel = await ApiClientInputValidator.getOrRenewApiKey(request, response);
            if(verificationModel.ValidFrom == null) {
                verificationModel.ValidFrom = new Date();
            }
            const apiKeyDto = await this._service.renewApiKey(verificationModel);
            if (apiKeyDto == null) {
                throw new ApiError(400, 'Unable to renew client api key.');
            }
            ResponseHandler.success(request, response, 'Client api keys renewed successfully!', 200, {
                ApiKeyDetails: apiKeyDto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
}

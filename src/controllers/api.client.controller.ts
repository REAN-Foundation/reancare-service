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
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
            var clientDomainModel: ApiClientDomainModel = await ApiClientInputValidator.getDomainModel(
                request.body
            );
            const client = await this._service.create(clientDomainModel);
            if (client == null) {
                throw new ApiError(400, 'Unable to create client.');
            }
            ResponseHandler.success(request, response, 'User retrieved successfully!', 200, {
                Client: client,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Client.GetById';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Client.Update';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Client.Delete';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getApiKey = async  (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Client.GetApiKey';
            var verificationModel = await ApiClientInputValidator.getVerificationDomainModel(
                request.body
            );
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
    }

}

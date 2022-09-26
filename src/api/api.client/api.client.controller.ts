import express from 'express';

import { ApiClientService } from '../../services/api.client/api.client.service';
import { ResponseHandler } from '../../common/response.handler';
import { Loader } from '../../startup/loader';
import { Authorizer } from '../../auth/authorizer';
import { ApiClientValidator } from './api.client.validator';
import { ApiError } from '../../common/api.error';

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

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Client.Create';
            await this._authorizer.authorize(request, response);

            const clientDomainModel = await ApiClientValidator.create(request);

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
            request.context = 'Client.GetById';
            await this._authorizer.authorize(request, response);

            const id: string = await ApiClientValidator.getById(request);

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

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Client.Search';
            await this._authorizer.authorize(request, response);

            const filters = await ApiClientValidator.search(request);

            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0 ? 'No records found!' : `Total ${count} api client records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                ApiClientRecords : searchResults,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Client.Update';
            await this._authorizer.authorize(request, response);

            const id: string = await ApiClientValidator.getById(request);
            const domainModel = await ApiClientValidator.update(request);
            const client = await this._service.update(id, domainModel);
            if (client == null) {
                throw new ApiError(404, 'Api client not found.');
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
            request.context = 'Client.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await ApiClientValidator.getById(request);
            await this._service.delete(id);
            ResponseHandler.success(request, response, 'Api client deleted successfully!', 200, null);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getCurrentApiKey = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Client.GetApiKey';

            //await this._authorizer.authorize(request, response);

            const verificationModel = await ApiClientValidator.getOrRenewApiKey(request);

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
            request.context = 'Client.RenewApiKey';

            //await this._authorizer.authorize(request, response);

            const verificationModel = await ApiClientValidator.getOrRenewApiKey(request);
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

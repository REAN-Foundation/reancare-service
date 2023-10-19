import express from 'express';

import { ClientAppService } from '../../services/client.apps/client.app.service';
import { ResponseHandler } from '../../common/handlers/response.handler';
import { Loader } from '../../startup/loader';
import { ClientAppValidator } from './client.app.validator';
import { ApiError } from '../../common/api.error';

///////////////////////////////////////////////////////////////////////////////////////

export class ClientAppController {

    //#region member variables and constructors

    _service: ClientAppService = null;

    constructor() {
        this._service = Loader.container.resolve(ClientAppService);
    }

    //#endregion

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Client.Create';
            const clientDomainModel = await ClientAppValidator.create(request);

            const clientApp = await this._service.create(clientDomainModel);
            if (clientApp == null) {
                throw new ApiError(400, 'Unable to create client app.');
            }
            ResponseHandler.success(request, response, 'Client app added successfully!', 201, {
                Client : clientApp,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Client.GetById';
            const id: string = await ClientAppValidator.getById(request);

            const clientApp = await this._service.getById(id);
            if (clientApp == null) {
                throw new ApiError(404, 'Client not found.');
            }
            ResponseHandler.success(request, response, 'Client app retrieved successfully!', 200, {
                Client : clientApp,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Client.Search';
            const filters = await ClientAppValidator.search(request);

            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0 ? 'No records found!' : `Total ${count} client app records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                ClientAppRecords : searchResults,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Client.Update';
            const id: string = await ClientAppValidator.getById(request);
            const domainModel = await ClientAppValidator.update(request);
            const clientApp = await this._service.update(id, domainModel);
            if (clientApp == null) {
                throw new ApiError(404, 'Client app not found.');
            }
            ResponseHandler.success(request, response, 'Client app updated successfully!', 200, {
                Client : clientApp,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Client.Delete';
            const id: string = await ClientAppValidator.getById(request);
            await this._service.delete(id);
            ResponseHandler.success(request, response, 'Client app deleted successfully!', 200, null);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getCurrentApiKey = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Client.GetApiKey';

            const verificationModel = await ClientAppValidator.getOrRenewApiKey(request);

            const apiKeyDto = await this._service.getApiKey(verificationModel);
            if (apiKeyDto == null) {
                throw new ApiError(400, 'Unable to retrieve client app api key.');
            }
            ResponseHandler.success(request, response, 'Client app api keys retrieved successfully!', 200, {
                ApiKeyDetails : apiKeyDto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    renewApiKey = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Client.RenewApiKey';
            const verificationModel = await ClientAppValidator.getOrRenewApiKey(request);
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
                throw new ApiError(400, 'Unable to renew client app api key.');
            }
            ResponseHandler.success(request, response, 'Client app api keys renewed successfully!', 200, {
                ApiKeyDetails : apiKeyDto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}

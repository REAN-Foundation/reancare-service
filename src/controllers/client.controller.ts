import express from 'express';

import { ClientService } from '../services/client.service';
import { ResponseHandler } from '../common/response.handler';
import { Loader } from '../startup/loader';
import { Authorizer } from '../auth/authorizer';
import { ClientDomainModel } from '../data/domain.types/client.domain.types';
import { ClientInputValidator } from './input.validators/client.input.validator';
import { ApiError } from '../common/api.error';
import { generate} from 'generate-password';

///////////////////////////////////////////////////////////////////////////////////////

export class ClientController {
    
    //#region member variables and constructors

    _service: ClientService = null;
    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(ClientService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    create = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Client.Create';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
            var clientDomainModel: ClientDomainModel = await ClientInputValidator.getDomainModel(
                request.body
            );
            if (clientDomainModel.ClientCode == null) {
                var name = clientDomainModel.ClientName;
                name = name.toLowerCase();
                var postfix = generate({
                    length: 8,
                    numbers: false,
                    lowercase: false,
                    uppercase: true,
                    symbols: false,
                });
                name = name + postfix;
                clientDomainModel.ClientCode = name.substr(0, 8);
            }
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

    getSecrets = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Client.GetSecrets';
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

}

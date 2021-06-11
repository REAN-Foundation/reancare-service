import express from 'express';
const { query, body, oneOf, validationResult, param } = require('express-validator');

import { ClientService } from '../services/client.service';
import { Helper } from '../common/helper';
import { ResponseHandler } from '../common/response.handler';
import { Loader } from '../startup/loader';
import { Authorizer } from '../auth/authorizer';
import { Number } from 'aws-sdk/clients/iot';
import { String } from 'aws-sdk/clients/appstream';

///////////////////////////////////////////////////////////////////////////////////////

export class ClientController {

    //#region member variables and constructors

    _service: ClientService = null;
    _authorizer: Authorizer = null;

    constructor() {
        this._service = new ClientService();
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region create

    create = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Client.Create';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
            var id: string = await this.sanitizeInput_create(request, response);
            const user = await this._service.create(id);
            if (user == null) {
                ResponseHandler.failure(request, response, 'User not found.', 404);
                return;
            }
            ResponseHandler.success(request, response, 'User retrieved successfully!', 200, {
                user: user,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    setContext_Create = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        request.context = 'Client.Create';
        next();
    };

    sanitize_Create = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            await body('ClientName').exists().isLength({ min: 1 }).trim().escape().run(request);
            await body('Phone').exists().trim().escape().isLength({ min: 10 }).run(request);
            await body('Email').exists().trim().escape().IsEmail().isLength({ min: 5 }).run(request);
            const result = validationResult(request);
            if (!result.isEmpty()) {
                Helper.handleValidationError(result);
            }
            next();
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    //#endregion
}

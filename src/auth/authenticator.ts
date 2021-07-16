import 'reflect-metadata';
import express from 'express';
import { IAuthenticator } from './authenticator.interface';
import { injectable, inject } from "tsyringe";

import { ResponseHandler } from '../common/response.handler';
import {Logger } from '../common/logger';

////////////////////////////////////////////////////////////////////////

@injectable()
export class Authenticator {
    
    constructor(
        @inject('IAuthenticator') private _authenticator: IAuthenticator
    ) {}

    public authenticateUser = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => {
        try {
            await this._authenticator.authenticateUser(request, response);
            next();
        } catch (error) {
            Logger.instance().log(error.message);
            ResponseHandler.failure(request, response, 'User authentication error: ' + error.message, 401);
        }
    };

    public authenticateClient = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => {
        try {
            await this._authenticator.authenticateClient(request, response);
            next();
        } catch (error) {
            Logger.instance().log(error.message);
            ResponseHandler.failure(request, response, 'Client authentication error: ' + error.message, 401);
        }
    };
}


////////////////////////////////////////////////////////////////////////

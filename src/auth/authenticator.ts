import 'reflect-metadata';
import express from 'express';
import { IAuthenticator } from './authenticator.interface';
import { injectable, inject } from "tsyringe";

import { ResponseHandler } from '../common/response.handler';
import { Logger } from '../common/logger';
import { ApiError } from '../common/api.error';

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
    ): Promise<boolean> => {
        try {
            const authResult = await this._authenticator.authenticateUser(request);
            if (authResult.Result === false){
                ResponseHandler.failure(request, response, authResult.Message, authResult.HttpErrorCode);
                return false;
            }
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
    ): Promise<boolean> => {
        try {
            const authResult = await this._authenticator.authenticateClient(request);
            if (authResult.Result === false){
                ResponseHandler.failure(request, response, authResult.Message, authResult.HttpErrorCode);
                return false;
            }
            next();
        } catch (error) {
            Logger.instance().log(error.message);
            ResponseHandler.failure(request, response, 'Client authentication error: ' + error.message, 401);
        }
    };

    public checkAuthentication = async(request: express.Request): Promise<boolean> => {
        const clientAuthResult = await this._authenticator.authenticateClient(request);
        if (clientAuthResult.Result === false){
            throw new ApiError(401, 'Unauthorized access');
        }
        const userAuthResult = await this._authenticator.authenticateUser(request);
        if (userAuthResult.Result === false){
            throw new ApiError(401, 'Unauthorized access');
        }
        return true;
    };

}

////////////////////////////////////////////////////////////////////////

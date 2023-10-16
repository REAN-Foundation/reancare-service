import 'reflect-metadata';
import express from 'express';
import { IAuthenticator } from './authenticator.interface';
import { injectable, inject } from 'tsyringe';
import { ResponseHandler } from '../common/response.handler';
import { Logger } from '../common/logger';
import { ApiError } from '../common/api.error';
import { uuid } from '../domain.types/miscellaneous/system.types';
import { CurrentUser } from '../domain.types/miscellaneous/current.user';

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

    public generateUserSessionToken = async (user: CurrentUser): Promise<string> => {
        return await this._authenticator.generateUserSessionToken(user);
    };

    public generateRefreshToken = async (userId: uuid, sessionId: uuid): Promise<string> => {
        return await this._authenticator.generateRefreshToken(userId, sessionId);
    };

    public rotateUserSessionToken = async (refreshToken: string): Promise<string> => {
        return await this._authenticator.rotateUserSessionToken(refreshToken);
    };

    public authenticateTerraWebhook = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<boolean> => {
        try {
            const authenticationResult = await this._authenticator.authenticateTerra(request);
            if (authenticationResult.Result === false){
                ResponseHandler.failure(request, response, authenticationResult.Message, authenticationResult.HttpErrorCode);
                return false;
            }
            next();
        } catch (error) {
            Logger.instance().log(error.message);
            ResponseHandler.failure(request, response, 'Client authentication error: ' + error.message, 401);
        }
    };

}

////////////////////////////////////////////////////////////////////////

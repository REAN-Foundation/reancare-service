import 'reflect-metadata';
import express from 'express';
import { IUserAuthenticator } from '../interfaces/user.authenticator.interface';
import { injectable, inject } from "tsyringe";
import { ResponseHandler } from '../../common/handlers/response.handler';
import { Logger } from '../../common/logger';

////////////////////////////////////////////////////////////////////////

@injectable()
export class UserAuthenticator {

    constructor(
        @inject('IUserAuthenticator') private _authenticator: IUserAuthenticator
    ) {}

    public authenticate = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        try {
            const authResult = await this._authenticator.authenticate(request);
            if (authResult.Result === false){
                ResponseHandler.failure(request, response, authResult.Message, authResult.HttpErrorCode);
            }
            next();
        } catch (error) {
            Logger.instance().log(error.message);
            ResponseHandler.failure(request, response, 'User authentication error: ' + error.message, 401);
        }
    };

    public verify = async (request: express.Request): Promise<boolean> => {
        const authResult = await this._authenticator.authenticate(request);
        return authResult.Result;
    };

    public generateUserSessionToken = async (user: any): Promise<string> => {
        const token = await this._authenticator.generateUserSessionToken(user);
        return token;
    };

    public generateRefreshToken = async (userId: string, sessionId: string, tenantId: string): Promise<string> => {
        const token = await this._authenticator.generateRefreshToken(userId, sessionId, tenantId);
        return token;
    };

    public rotateUserSessionToken = async (refreshToken: string): Promise<string> => {
        const token = await this._authenticator.rotateUserSessionToken(refreshToken);
        return token;
    };

}

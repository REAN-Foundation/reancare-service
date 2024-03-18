import express from 'express';
import 'reflect-metadata';
import { inject, injectable } from "tsyringe";
import { IUserAuthorizer } from '../interfaces/user.authorizer.interface';
import { ResponseHandler } from '../../common/handlers/response.handler';

////////////////////////////////////////////////////////////////////////

@injectable()
export class UserAuthorizer {

    constructor(@inject('IUserAuthorizer') private _authorizer: IUserAuthorizer) {}

    public authorize = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const authorized = await this._authorizer.authorize(request, response);
        if (!authorized) {
            ResponseHandler.failure(request, response, 'Unauthorized access', 403);
            return;
        }
        next();
    };

    public verify = async (request: express.Request): Promise<boolean> => {
        const authorized = await this._authorizer.authorize(request, null);
        return authorized;
    };

}

import express from 'express';
import 'reflect-metadata';
import { inject, injectable } from "tsyringe";
import { ErrorHandler } from '../../common/handlers/error.handler';
import { IUserAuthorizer } from '../interfaces/user.authorizer.interface';

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
            ErrorHandler.throwUnauthorizedUserError('Unauthorized access');
        }
        next();
    };

    public verify = async (request: express.Request): Promise<boolean> => {
        const authorized = await this._authorizer.authorize(request, null);
        return authorized;
    };

}

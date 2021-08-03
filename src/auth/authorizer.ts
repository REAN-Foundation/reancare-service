import 'reflect-metadata';
import express from 'express';
import { IAuthorizer } from './authorizer.interface';
import { injectable, inject } from "tsyringe";
import { CurrentUser } from '../data/domain.types/current.user';
import { ApiError } from '../common/api.error';

////////////////////////////////////////////////////////////////////////

@injectable()
export class Authorizer {

    constructor(@inject('IAuthorizer') private _authorizer: IAuthorizer) {}

    public authorize = async (
        request: express.Request,
        response: express.Response
    ): Promise<void> => {
        const authorized = await this._authorizer.authorize(request, response);
        if (!authorized) {
            throw new ApiError(403, 'Unauthorized access');
        }
    };

    public generateUserSessionToken = async (user: CurrentUser): Promise<string> => {
        return await this._authorizer.generateUserSessionToken(user);
    }

}

////////////////////////////////////////////////////////////////////////

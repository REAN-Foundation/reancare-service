import express from 'express';
import 'reflect-metadata';
import { inject, injectable } from "tsyringe";
import { ApiError } from '../common/api.error';
import { IAuthorizer } from './authorizer.interface';

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

}

////////////////////////////////////////////////////////////////////////

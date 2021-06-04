import 'reflect-metadata';
import express from 'express';
import { IAuthorizer } from '../interfaces/authorizer.interface';
import { injectable, inject } from "tsyringe";
import { ResponseHandler } from '../common/response.handler';

////////////////////////////////////////////////////////////////////////

@injectable()
export class Authorizer {
    constructor(@inject('IAuthorizer') private _authorizer: IAuthorizer) {}

    public authorize = async (
        request: express.Request,
        response: express.Response
    ) => {
        var authorized = await this._authorizer.authorize(request, response);
        if(!authorized) {
            ResponseHandler.failure(request, response, 'Unauthorized access', 403);
            return false;
        }
        return true;
    };
}


////////////////////////////////////////////////////////////////////////

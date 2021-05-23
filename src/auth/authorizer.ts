import 'reflect-metadata';
import express from 'express';
import { IAuthorizer } from '../interfaces/authorizer.interface';
import { injectable, inject } from "tsyringe";

////////////////////////////////////////////////////////////////////////

@injectable()
export class Authorizer {
    
    constructor(
        @inject('IAuthorizer') private _authorizer: IAuthorizer
    ) {}

    public authorize = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => {
        try {
            await this._authorizer.authorize(request, response);
            next();
        } catch (error) {

        }
    };
}


////////////////////////////////////////////////////////////////////////

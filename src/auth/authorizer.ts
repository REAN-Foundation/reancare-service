import express from 'express';
import 'reflect-metadata';
import { inject, injectable } from "tsyringe";
import { CurrentUser } from '../domain.types/miscellaneous/current.user';
import { IAuthorizer } from './authorizer.interface';

////////////////////////////////////////////////////////////////////////

@injectable()
export class Authorizer {

    constructor(@inject('IAuthorizer') private _authorizer: IAuthorizer) {}

    public authorize = async (
        request: express.Request,
        response: express.Response
    ): Promise<boolean> => {
        return await this._authorizer.authorize(request, response);
    };

    public generateUserSessionToken = async (user: CurrentUser): Promise<string> => {
        return await this._authorizer.generateUserSessionToken(user);
    }

}

////////////////////////////////////////////////////////////////////////

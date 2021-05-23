import 'reflect-metadata';
import express from 'express';
import { IAuthenticator } from '../interfaces/authenticator.interface';
import { injectable, inject } from "tsyringe";

////////////////////////////////////////////////////////////////////////

@injectable()
export class Authenticator {
    
    constructor(
        @inject('IAuthenticator') private _authenticator: IAuthenticator
    ) {}

    public authenticate = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => {
        try {
            await this._authenticator.authenticate(request, response);
            next();
        } catch (error) {

        }
    };
}


////////////////////////////////////////////////////////////////////////

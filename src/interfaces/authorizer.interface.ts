import express from 'express';
import { CurrentUser } from '../data/dtos/current.user.dto';

export interface IAuthorizer {

    authorize(
        request: express.Request, 
        response: express.Response) : Promise<any>;

    generateUserSessionToken(user: CurrentUser): Promise<string>;
}

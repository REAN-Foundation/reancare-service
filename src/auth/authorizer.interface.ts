import express from 'express';
import { CurrentUser } from '../data/domain.types/current.user';

export interface IAuthorizer {

    authorize(
        request: express.Request, 
        response: express.Response) : Promise<any>;

    generateUserSessionToken(user: CurrentUser): Promise<string>;
}

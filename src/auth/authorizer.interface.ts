import express from 'express';
import { CurrentUser } from '../domain.types/miscellaneous/current.user';

////////////////////////////////////////////////////////////////////////

export interface IAuthorizer {

    authorize(
        request: express.Request,
        response: express.Response) : Promise<boolean>;

    generateUserSessionToken(user: CurrentUser): Promise<string>;
}

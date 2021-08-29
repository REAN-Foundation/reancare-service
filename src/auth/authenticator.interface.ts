import express from 'express';
import { AuthenticationResult } from '../domain.types/auth/auth.domain.types';

export interface IAuthenticator {

    authenticateUser(
        request: express.Request,
        response: express.Response) : Promise<AuthenticationResult>;

    authenticateClient(
        request: express.Request,
        response: express.Response) : Promise<AuthenticationResult>;

}

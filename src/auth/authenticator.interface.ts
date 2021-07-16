import express from 'express';

export interface IAuthenticator {

    authenticateUser(
        request: express.Request, 
        response: express.Response) : Promise<any>;

    authenticateClient(
        request: express.Request, 
        response: express.Response) : Promise<any>;

}

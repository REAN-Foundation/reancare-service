import express from 'express';

export interface IAuthenticator {

    authenticate(
        request: express.Request, 
        response: express.Response) : Promise<any>;
}

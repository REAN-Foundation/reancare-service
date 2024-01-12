import express from 'express';

////////////////////////////////////////////////////////////////////////

export interface IUserAuthorizer {

    authorize(
        request: express.Request,
        response: express.Response) : Promise<boolean>;

}

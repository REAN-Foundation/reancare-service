import express from 'express';

////////////////////////////////////////////////////////////////////////

export interface IAuthorizer {

    authorize(
        request: express.Request,
        response: express.Response) : Promise<boolean>;

}

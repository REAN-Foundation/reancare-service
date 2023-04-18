import express from 'express';

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IWebhooksService {

    providerName(): string;

    receive(request: express.Request, response: express.Response): Promise<void>;

}

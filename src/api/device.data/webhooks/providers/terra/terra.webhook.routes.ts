import express from 'express';
import { Loader } from '../../../../../startup/loader';
import { WebhooksHandler } from '../../webhooks.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    
    router.post('/terra/webhook', WebhooksHandler.receive);
    app.use('/api/v1/device.data', router);
};

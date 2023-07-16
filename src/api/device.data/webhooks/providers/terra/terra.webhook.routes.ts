import express from 'express';
import { WebhooksHandler } from '../../webhooks.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    
    router.post('/terra/webhook', WebhooksHandler.receive);
    app.use('/api/v1/device.data', router);
};

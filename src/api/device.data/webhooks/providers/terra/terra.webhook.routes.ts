import express from 'express';
import { WebhooksHandler } from '../../webhooks.handler';
import { Loader } from '../../../../../startup/loader';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;

    router.post('/terra/webhook', authenticator.authenticateTerraWebhook, WebhooksHandler.receive);

    app.use('/api/v1/device.data', router);
};

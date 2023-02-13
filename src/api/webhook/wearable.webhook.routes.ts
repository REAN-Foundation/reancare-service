import express from 'express';
import { Loader } from '../../startup/loader';
import { TeraWebhookController } from './wearable.webhook.controller';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new TeraWebhookController();

    router.post('/terra/webhook', authenticator.authenticateClient, controller.receive);
    app.use('/api/v1/device.data', router);
};

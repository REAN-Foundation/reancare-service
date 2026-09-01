import express from 'express';
import { Logger } from '../../common/logger';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();

    router.post('/enable-debug', (request: express.Request, response: express.Response): void => {
        Logger.instance().setDebugEnabled(true);
        response.status(200).json({ message: 'Debug enabled' });
    });

    router.post('/disable-debug', (request: express.Request, response: express.Response): void => {
        Logger.instance().setDebugEnabled(false);
        response.status(200).json({ message: 'Debug disabled' });
    });

    app.use('/api/v1/debug', router);
};

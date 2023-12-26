import express from 'express';
import { AhaStatisticsController } from './aha.statistics.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new AhaStatisticsController();

    router.get('/', authenticator.authenticateClient, controller.getAhaStatistics);
   
    app.use('/api/v1/aha-statistics', router);
};

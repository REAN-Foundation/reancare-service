import express from 'express';
import { AhaNumbersController } from './aha.numbers.controller';
import { AhaNumbersAuth } from './aha.numbers.auth';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const controller = new AhaNumbersController();

    const router = express.Router();

    router.post('/upload', auth(AhaNumbersAuth.upload),controller.upload);

    router.get('/download', auth(AhaNumbersAuth.download), controller.download);

    app.use('/api/v1/statistics/aha-numbers', router);

};

import express from 'express';
import { LocationController } from './location.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new LocationController();

    router.post('/', auth('General.Location.Create'), controller.create);

    app.use('/api/v1/locations', router);
};

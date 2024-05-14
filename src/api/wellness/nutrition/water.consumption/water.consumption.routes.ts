/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { WaterConsumptionController } from './water.consumption.controller';
import { WaterConsumptionAuth } from './water.consumption.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new WaterConsumptionController();

    router.post('/', auth(WaterConsumptionAuth.create), controller.create);
    router.get('/search', auth(WaterConsumptionAuth.search), controller.search);
    router.get('/:id', auth(WaterConsumptionAuth.getById), controller.getById);
    router.put('/:id', auth(WaterConsumptionAuth.update), controller.update);
    router.delete('/:id', auth(WaterConsumptionAuth.delete), controller.delete);

    app.use('/api/v1/wellness/nutrition/water-consumptions', router);
};

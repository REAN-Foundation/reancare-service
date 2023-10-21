/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { WaterConsumptionController } from './water.consumption.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new WaterConsumptionController();

    router.post('/', auth('Nutrition.WaterConsumption.Create'), controller.create);
    router.get('/search', auth('Nutrition.WaterConsumption.Search'), controller.search);
    router.get('/:id', auth('Nutrition.WaterConsumption.GetById'), controller.getById);
    router.put('/:id', auth('Nutrition.WaterConsumption.Update'), controller.update);
    router.delete('/:id', auth('Nutrition.WaterConsumption.Delete'), controller.delete);

    app.use('/api/v1/wellness/nutrition/water-consumptions', router);
};

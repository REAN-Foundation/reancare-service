/* eslint-disable max-len */
import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { WaterConsumptionController } from './water.consumption.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new WaterConsumptionController();

    router.post('/', auth('Wellness.Nutrition.WaterConsumption.Create'), controller.create);
    router.get('/search', auth('Wellness.Nutrition.WaterConsumption.Search'), controller.search);
    router.get('/:id', auth('Wellness.Nutrition.WaterConsumption.GetById'), controller.getById);
    router.put('/:id', auth('Wellness.Nutrition.WaterConsumption.Update'), controller.update);
    router.delete('/:id', auth('Wellness.Nutrition.WaterConsumption.Delete'), controller.delete);

    app.use('/api/v1/wellness/nutrition/water-consumptions', router);
};

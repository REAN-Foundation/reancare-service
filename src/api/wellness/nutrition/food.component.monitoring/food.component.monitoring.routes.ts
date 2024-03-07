import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { FoodComponentMonitoringController } from './food.component.monitoring.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new FoodComponentMonitoringController();

    router.post('/', auth('Wellness.Nutrition.FoodComponentMonitoring.Create'), controller.create);
    router.get('/search', auth('Wellness.Nutrition.FoodComponentMonitoring.Search'), controller.search);
    router.get('/:id', auth('Wellness.Nutrition.FoodComponentMonitoring.GetById'), controller.getById);
    router.put('/:id', auth('Wellness.Nutrition.FoodComponentMonitoring.Update'), controller.update);
    router.delete('/:id', auth('Wellness.Nutrition.FoodComponentMonitoring.Delete'), controller.delete);

    app.use('/api/v1/wellness/food-components-monitoring', router);
};

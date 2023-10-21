import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { FoodComponentMonitoringController } from './food.component.monitoring.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new FoodComponentMonitoringController();

    router.post('/', auth('FoodComponentMonitoring.Create'), controller.create);
    router.get('/search', auth('FoodComponentMonitoring.Search'), controller.search);
    router.get('/:id', auth('FoodComponentMonitoring.GetById'), controller.getById);
    router.put('/:id', auth('FoodComponentMonitoring.Update'), controller.update);
    router.delete('/:id', auth('FoodComponentMonitoring.Delete'), controller.delete);

    app.use('/api/v1/wellness/food-components-monitoring', router);
};

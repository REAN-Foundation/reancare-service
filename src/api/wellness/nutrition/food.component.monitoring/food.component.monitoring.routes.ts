import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { FoodComponentMonitoringController } from './food.component.monitoring.controller';
import { FoodComponentMonitoringAuth } from './food.component.monitoring.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new FoodComponentMonitoringController();

    router.post('/', auth(FoodComponentMonitoringAuth.create), controller.create);
    router.get('/search', auth(FoodComponentMonitoringAuth.search), controller.search);
    router.get('/:id', auth(FoodComponentMonitoringAuth.getById), controller.getById);
    router.put('/:id', auth(FoodComponentMonitoringAuth.update), controller.update);
    router.delete('/:id', auth(FoodComponentMonitoringAuth.delete), controller.delete);

    app.use('/api/v1/wellness/food-components-monitoring', router);
};

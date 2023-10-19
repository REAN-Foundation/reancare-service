import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { FoodComponentMonitoringController } from './food.component.monitoring.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new FoodComponentMonitoringController();

    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/wellness/food-components-monitoring', router);
};

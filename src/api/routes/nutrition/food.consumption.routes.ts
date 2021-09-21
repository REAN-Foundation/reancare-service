import express from 'express';
import { FoodConsumptionController } from '../../controllers/nutrition/food.consumption.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new FoodConsumptionController();

    router.post('/', authenticator.authenticateClient, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:patientUserId/by-event/:event', authenticator.authenticateClient, authenticator.authenticateUser, controller.getByEvent);
    router.get('/:patientUserId/for-day/:date', authenticator.authenticateClient, authenticator.authenticateUser, controller.getForDay);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/nutrition/food-consumption', router);
};

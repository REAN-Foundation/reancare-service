import express from 'express';
import { FoodConsumptionController } from '../../controllers/nutritions/food.consumption.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new FoodConsumptionController();

    router.post('/', authenticator.authenticateClient, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:patientUserId/by-event/:event', authenticator.authenticateClient, authenticator.authenticateUser, controller.getByEvent);
    router.get('/:patientUserId/by-date/:date', authenticator.authenticateClient, authenticator.authenticateUser, controller.getByDate);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/nutritions/food-consumption', router);
};

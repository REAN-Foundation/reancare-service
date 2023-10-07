import express from 'express';
import { Loader } from '../../../../startup/loader';
import { FoodConsumptionController } from './food.consumption.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new FoodConsumptionController();

    router.post('/', authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateUser, controller.search);
    router.get('/:patientUserId/consumed-as/:consumedAs', authenticator.authenticateUser, controller.getByEvent);
    router.get('/:patientUserId/for-day/:date', authenticator.authenticateUser, controller.getForDay);
    router.get('/questionnaire', controller.getNutritionQuestionnaire);
    router.get('/:id', authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/wellness/nutrition/food-consumptions', router);
};

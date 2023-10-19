import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { FoodConsumptionController } from './food.consumption.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new FoodConsumptionController();

    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/:patientUserId/consumed-as/:consumedAs', auth(), controller.getByEvent);
    router.get('/:patientUserId/for-day/:date', auth(), controller.getForDay);
    router.get('/questionnaire', controller.getNutritionQuestionnaire);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/wellness/nutrition/food-consumptions', router);
};

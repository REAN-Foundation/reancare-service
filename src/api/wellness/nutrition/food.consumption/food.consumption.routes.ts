import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { FoodConsumptionController } from './food.consumption.controller';
import { FoodConsumptionAuth } from './food.consumption.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new FoodConsumptionController();

    router.post('/', auth(FoodConsumptionAuth.create), controller.create);
    router.get('/search', auth(FoodConsumptionAuth.search), controller.search);
    router.get('/:patientUserId/consumed-as/:consumedAs', auth(FoodConsumptionAuth.getByEvent), controller.getByEvent);
    router.get('/:patientUserId/for-day/:date', auth(FoodConsumptionAuth.getForDay), controller.getForDay);
    router.get('/questionnaire', auth(FoodConsumptionAuth.getNutritionQuestionnaire), controller.getNutritionQuestionnaire);
    router.get('/:id', auth(FoodConsumptionAuth.getById), controller.getById);
    router.put('/:id', auth(FoodConsumptionAuth.update), controller.update);
    router.delete('/:id', auth(FoodConsumptionAuth.delete), controller.delete);

    app.use('/api/v1/wellness/nutrition/food-consumptions', router);
};

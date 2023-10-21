import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { FoodConsumptionController } from './food.consumption.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new FoodConsumptionController();

    router.post('/', auth('Nutrition.FoodConsumption.Create'), controller.create);
    router.get('/search', auth('Nutrition.FoodConsumption.Search'), controller.search);
    router.get('/:patientUserId/consumed-as/:consumedAs', auth('Nutrition.FoodConsumption.GetByEvent'), controller.getByEvent);
    router.get('/:patientUserId/for-day/:date', auth('Nutrition.FoodConsumption.GetForDay'), controller.getForDay);
    router.get('/questionnaire', auth('Nutrition.GetNutritionQuestionnaire', true), controller.getNutritionQuestionnaire);
    router.get('/:id', auth('Nutrition.FoodConsumption.GetById'), controller.getById);
    router.put('/:id', auth('Nutrition.FoodConsumption.Update'), controller.update);
    router.delete('/:id', auth('Nutrition.FoodConsumption.Delete'), controller.delete);

    app.use('/api/v1/wellness/nutrition/food-consumptions', router);
};

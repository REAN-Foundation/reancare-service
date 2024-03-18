import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { FoodConsumptionController } from './food.consumption.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new FoodConsumptionController();

    router.post('/', auth('Wellness.Nutrition.FoodConsumption.Create'), controller.create);
    router.get('/search', auth('Wellness.Nutrition.FoodConsumption.Search'), controller.search);
    router.get('/:patientUserId/consumed-as/:consumedAs', auth('Wellness.Nutrition.FoodConsumption.GetByEvent'), controller.getByEvent);
    router.get('/:patientUserId/for-day/:date', auth('Wellness.Nutrition.FoodConsumption.GetForDay'), controller.getForDay);
    router.get('/questionnaire', auth('Wellness.Nutrition.Questionnaire.GetNutritionQuestionnaire', true), controller.getNutritionQuestionnaire);
    router.get('/:id', auth('Wellness.Nutrition.FoodConsumption.GetById'), controller.getById);
    router.put('/:id', auth('Wellness.Nutrition.FoodConsumption.Update'), controller.update);
    router.delete('/:id', auth('Wellness.Nutrition.FoodConsumption.Delete'), controller.delete);

    app.use('/api/v1/wellness/nutrition/food-consumptions', router);
};

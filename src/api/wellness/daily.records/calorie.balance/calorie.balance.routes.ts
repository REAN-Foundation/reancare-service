import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { CalorieBalanceController } from './calorie.balance.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CalorieBalanceController();

    router.post('/', auth('Wellness.DailyRecords.CalorieBalance.Create'), controller.create);
    router.get('/search', auth('Wellness.DailyRecords.CalorieBalance.Search'), controller.search);
    router.get('/:id', auth('Wellness.DailyRecords.CalorieBalance.GetById'), controller.getById);
    router.put('/:id', auth('Wellness.DailyRecords.CalorieBalance.Update'), controller.update);
    router.delete('/:id', auth('Wellness.DailyRecords.CalorieBalance.Delete'), controller.delete);

    app.use('/api/v1/wellness/daily-records/calorie-balances', router);
};

import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { CalorieBalanceController } from './calorie.balance.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CalorieBalanceController();

    router.post('/', auth('DailyRecords.CalorieBalance.Create'), controller.create);
    router.get('/search', auth('DailyRecords.CalorieBalance.Search'), controller.search);
    router.get('/:id', auth('DailyRecords.CalorieBalance.GetById'), controller.getById);
    router.put('/:id', auth('DailyRecords.CalorieBalance.Update'), controller.update);
    router.delete('/:id', auth('DailyRecords.CalorieBalance.Delete'), controller.delete);

    app.use('/api/v1/wellness/daily-records/calorie-balances', router);
};

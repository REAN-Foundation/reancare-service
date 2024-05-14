import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { CalorieBalanceController } from './calorie.balance.controller';
import { CalorieBalanceAuth } from './calorie.balance.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CalorieBalanceController();

    router.post('/', auth(CalorieBalanceAuth.create), controller.create);
    router.get('/search', auth(CalorieBalanceAuth.search), controller.search);
    router.get('/:id', auth(CalorieBalanceAuth.getById), controller.getById);
    router.put('/:id', auth(CalorieBalanceAuth.update), controller.update);
    router.delete('/:id', auth(CalorieBalanceAuth.delete), controller.delete);

    app.use('/api/v1/wellness/daily-records/calorie-balances', router);
};

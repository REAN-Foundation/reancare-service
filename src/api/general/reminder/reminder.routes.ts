import express from 'express';
import { ReminderController } from './reminder.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ReminderController();

    router.post('/one-time', auth(), controller.createOneTimeReminder);
    router.post('/repeat-after-every-n', auth(), controller.createReminderWithRepeatAfterEveryN);
    router.post('/repeat-every-weekday', auth(), controller.createReminderWithRepeatEveryWeekday);
    router.post('/repeat-every-week-on-days', auth(), controller.createReminderWithRepeatEveryWeekOnDays);
    router.post('/repeat-every-month-on', auth(), controller.createReminderWithEveryMonthOn);
    router.post('/repeat-every-quarter-on', auth(), controller.createReminderWithEveryQuarterOn);
    router.post('/repeat-every-hour', auth(), controller.createReminderWithRepeatEveryHour);
    router.post('/repeat-every-day', auth(), controller.createReminderWithRepeatEveryDay);

    router.get('/search', auth(), controller.search);
    router.get('/:id', auth(), controller.getById);
    router.delete('/:id', auth(), controller.delete);

    //router.post('/:id/snooze', auth(), controller.snooze);

    app.use('/api/v1/reminders', router);
};

import express from 'express';
import { ReminderController } from './reminder.controller';
import { auth } from '../../../auth/auth.handler';
import { ReminderAuth } from './reminder.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ReminderController();

    router.post('/one-time', auth(ReminderAuth.createOneTimeReminder), controller.createOneTimeReminder);
    router.post('/repeat-after-every-n', auth(ReminderAuth.createReminderWithRepeatAfterEveryN), controller.createReminderWithRepeatAfterEveryN);
    router.post('/repeat-every-weekday', auth(ReminderAuth.createReminderWithRepeatEveryWeekday), controller.createReminderWithRepeatEveryWeekday);
    router.post('/repeat-every-week-on-days', auth(ReminderAuth.createReminderWithRepeatEveryWeekOnDays), controller.createReminderWithRepeatEveryWeekOnDays);
    router.post('/repeat-every-month-on', auth(ReminderAuth.createReminderWithEveryMonthOn), controller.createReminderWithEveryMonthOn);
    router.post('/repeat-every-quarter-on', auth(ReminderAuth.createReminderWithEveryQuarterOn), controller.createReminderWithEveryQuarterOn);
    router.post('/repeat-every-hour', auth(ReminderAuth.createReminderWithRepeatEveryHour), controller.createReminderWithRepeatEveryHour);
    router.post('/repeat-every-day', auth(ReminderAuth.createReminderWithRepeatEveryDay), controller.createReminderWithRepeatEveryDay);

    router.get('/search', auth(ReminderAuth.search), controller.search);
    router.get('/:id', auth(ReminderAuth.getById), controller.getById);
    router.delete('/:id', auth(ReminderAuth.delete), controller.delete);

    //router.post('/:id/snooze', auth(), controller.snooze);

    app.use('/api/v1/reminders', router);
};

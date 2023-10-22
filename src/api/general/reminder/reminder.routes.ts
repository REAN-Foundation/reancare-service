import express from 'express';
import { ReminderController } from './reminder.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ReminderController();

    router.post('/one-time', auth('General.Reminder.CreateOneTimeReminder'), controller.createOneTimeReminder);
    router.post('/repeat-after-every-n', auth('General.Reminder.CreateReminderWithRepeatAfterEveryN'), controller.createReminderWithRepeatAfterEveryN);
    router.post('/repeat-every-weekday', auth('General.Reminder.CreateReminderWithRepeatEveryWeekday'), controller.createReminderWithRepeatEveryWeekday);
    router.post('/repeat-every-week-on-days', auth('General.Reminder.CreateReminderWithRepeatEveryWeekOnDays'), controller.createReminderWithRepeatEveryWeekOnDays);
    router.post('/repeat-every-month-on', auth('General.Reminder.CreateReminderWithEveryMonthOn'), controller.createReminderWithEveryMonthOn);
    router.post('/repeat-every-quarter-on', auth('General.Reminder.CreateReminderWithEveryQuarterOn'), controller.createReminderWithEveryQuarterOn);
    router.post('/repeat-every-hour', auth('General.Reminder.CreateReminderWithRepeatEveryHour'), controller.createReminderWithRepeatEveryHour);
    router.post('/repeat-every-day', auth('General.Reminder.CreateReminderWithRepeatEveryDay'), controller.createReminderWithRepeatEveryDay);

    router.get('/search', auth('General.Reminder.Search'), controller.search);
    router.get('/:id', auth('General.Reminder.GetById'), controller.getById);
    router.delete('/:id', auth('General.Reminder.Delete'), controller.delete);

    //router.post('/:id/snooze', auth(), controller.snooze);

    app.use('/api/v1/reminders', router);
};

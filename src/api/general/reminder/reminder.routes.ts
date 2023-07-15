import express from 'express';
import { ReminderController } from './reminder.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new ReminderController();

    router.post('/one-time', authenticator.authenticateClient, authenticator.authenticateUser, controller.createOneTimeReminder);
    router.post('/repeat-after-every-n', authenticator.authenticateClient, authenticator.authenticateUser, controller.createReminderWithRepeatAfterEveryN);
    router.post('/repeat-every-weekday', authenticator.authenticateClient, authenticator.authenticateUser, controller.createReminderWithRepeatEveryWeekday);
    router.post('/repeat-every-week-on-days', authenticator.authenticateClient, authenticator.authenticateUser, controller.createReminderWithRepeatEveryWeekOnDays);
    router.post('/repeat-every-month-on', authenticator.authenticateClient, authenticator.authenticateUser, controller.createReminderWithEveryMonthOn);
    router.post('/repeat-every-quarter-on', authenticator.authenticateClient, authenticator.authenticateUser, controller.createReminderWithEveryQuarterOn);
    router.post('/repeat-every-hour', authenticator.authenticateClient, authenticator.authenticateUser, controller.createReminderWithRepeatEveryHour);
    router.post('/repeat-every-day', authenticator.authenticateClient, authenticator.authenticateUser, controller.createReminderWithRepeatEveryDay);

    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    //router.post('/:id/snooze', authenticator.authenticateClient, authenticator.authenticateUser, controller.snooze);

    app.use('/api/v1/reminders', router);
};

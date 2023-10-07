import express from 'express';
import { Loader } from '../../../../startup/loader';
import { MedicationConsumptionController } from './medication.consumption.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new MedicationConsumptionController();

    router.put('/mark-list-as-taken', authenticator.authenticateUser, controller.markListAsTaken);
    router.put('/mark-list-as-missed', authenticator.authenticateUser, controller.markListAsMissed);
    router.put('/mark-as-taken/:id', authenticator.authenticateUser, controller.markAsTaken);
    router.put('/mark-as-missed/:id', authenticator.authenticateUser, controller.markAsMissed);

    router.post('/delete-future-schedules/:medicationId', authenticator.authenticateUser, controller.deleteFutureMedicationSchedules);

    router.get('/search-for-patient/:patientUserId', authenticator.authenticateUser, controller.searchForPatient);
    router.get('/schedule-for-duration/:patientUserId', authenticator.authenticateUser, controller.getScheduleForDuration);
    router.get('/schedule-for-day/:patientUserId/:date', authenticator.authenticateUser, controller.getScheduleForDay);
    router.get('/summary-for-day/:patientUserId/:date', authenticator.authenticateUser, controller.getSummaryForDay);
    router.get('/summary-for-calendar-months/:patientUserId', authenticator.authenticateUser, controller.getSummaryByCalendarMonths);
    router.get('/:id', authenticator.authenticateUser, controller.getById);

    app.use('/api/v1/clinical/medication-consumptions', router);
};

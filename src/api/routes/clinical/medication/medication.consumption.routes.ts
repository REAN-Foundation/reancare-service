import express from 'express';
import { Loader } from '../../../../startup/loader';
import { MedicationConsumptionController } from '../../../controllers/clinical/medication/medication.consumption.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new MedicationConsumptionController();

    router.put('/mark-as-taken/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.markAsTaken);
    router.put('/mark-list-as-taken', authenticator.authenticateClient, authenticator.authenticateUser, controller.markListAsTaken);
    router.put('/mark-as-missed/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.markAsMissed);
    router.put('/mark-list-as-missed', authenticator.authenticateClient, authenticator.authenticateUser, controller.markListAsMissed);

    router.post('/cancel-future-schedules/:medicationId', authenticator.authenticateClient, authenticator.authenticateUser, controller.cancelFutureMedicationSchedules);
    router.post('/delete-future-schedules/:medicationId', authenticator.authenticateClient, authenticator.authenticateUser, controller.deleteFutureMedicationSchedules);

    router.get('/all/:patientUserId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getMedicationConsumptions);
    router.get('/schedule-for-duration/:patientUserId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getMedicationSchedule);
    router.get('/schedule-for-day/:patientUserId/:date', authenticator.authenticateClient, authenticator.authenticateUser, controller.getMedicationScheduleForDay);
    router.get('/summary-for-day/:patientUserId/:date', authenticator.authenticateClient, authenticator.authenticateUser, controller.getMedicationConsumptionSummaryForDay);
    router.get('/summary-for-calendar-months/:patientUserId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getSummaryByCalendarMonths);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getMedicationConsumption);

    app.use('/api/v1/medication-consumptions', router);
};

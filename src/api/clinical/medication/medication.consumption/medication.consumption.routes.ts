import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { MedicationConsumptionController } from './medication.consumption.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MedicationConsumptionController();

    router.put('/mark-list-as-taken', auth(), controller.markListAsTaken);
    router.put('/mark-list-as-missed', auth(), controller.markListAsMissed);
    router.put('/mark-as-taken/:id', auth(), controller.markAsTaken);
    router.put('/mark-as-missed/:id', auth(), controller.markAsMissed);

    router.post('/delete-future-schedules/:medicationId', auth(), controller.deleteFutureMedicationSchedules);

    router.get('/search-for-patient/:patientUserId', auth(), controller.searchForPatient);
    router.get('/schedule-for-duration/:patientUserId', auth(), controller.getScheduleForDuration);
    router.get('/schedule-for-day/:patientUserId/:date', auth(), controller.getScheduleForDay);
    router.get('/summary-for-day/:patientUserId/:date', auth(), controller.getSummaryForDay);
    router.get('/summary-for-calendar-months/:patientUserId', auth(), controller.getSummaryByCalendarMonths);
    router.get('/:id', auth(), controller.getById);

    app.use('/api/v1/clinical/medication-consumptions', router);
};

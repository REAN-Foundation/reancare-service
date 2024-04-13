import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { MedicationConsumptionController } from './medication.consumption.controller';
import { MedicationConsumptionAuth } from './medication.consumption.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MedicationConsumptionController();

    router.put('/mark-list-as-taken', auth(MedicationConsumptionAuth.markAsTaken), controller.markListAsTaken);
    router.put('/mark-list-as-missed', auth(MedicationConsumptionAuth.markAsMissed), controller.markListAsMissed);
    router.put('/mark-as-taken/:id', auth(MedicationConsumptionAuth.markAsTaken), controller.markAsTaken);
    router.put('/mark-as-missed/:id', auth(MedicationConsumptionAuth.markAsMissed), controller.markAsMissed);

    router.post('/delete-future-schedules/:medicationId', auth(MedicationConsumptionAuth.deleteFutureMedicationSchedules), controller.deleteFutureMedicationSchedules);

    router.get('/search-for-patient/:patientUserId', auth(MedicationConsumptionAuth.searchForPatient), controller.searchForPatient);
    router.get('/schedule-for-duration/:patientUserId', auth(MedicationConsumptionAuth.getScheduleForDuration), controller.getScheduleForDuration);
    router.get('/schedule-for-day/:patientUserId/:date', auth(MedicationConsumptionAuth.getScheduleForDay), controller.getScheduleForDay);
    router.get('/summary-for-day/:patientUserId/:date', auth(MedicationConsumptionAuth.getSummaryForDay), controller.getSummaryForDay);
    router.get('/summary-for-calendar-months/:patientUserId', auth(MedicationConsumptionAuth.getSummaryByCalendarMonths), controller.getSummaryByCalendarMonths);
    router.get('/:id', auth(MedicationConsumptionAuth.getById), controller.getById);

    app.use('/api/v1/clinical/medication-consumptions', router);
};

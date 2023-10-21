import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { MedicationConsumptionController } from './medication.consumption.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MedicationConsumptionController();

    router.put('/mark-list-as-taken', auth('MedicationConsumption.MarkListAsTaken'), controller.markListAsTaken);
    router.put('/mark-list-as-missed', auth('MedicationConsumption.MarkListAsMissed'), controller.markListAsMissed);
    router.put('/mark-as-taken/:id', auth('MedicationConsumption.MarkAsTaken'), controller.markAsTaken);
    router.put('/mark-as-missed/:id', auth('MedicationConsumption.MarkAsMissed'), controller.markAsMissed);

    router.post('/delete-future-schedules/:medicationId', auth('MedicationConsumption.DeleteFutureMedicationSchedules'), controller.deleteFutureMedicationSchedules);

    router.get('/search-for-patient/:patientUserId', auth('MedicationConsumption.Search'), controller.searchForPatient);
    router.get('/schedule-for-duration/:patientUserId', auth('MedicationConsumption.GetMedicationSchedule'), controller.getScheduleForDuration);
    router.get('/schedule-for-day/:patientUserId/:date', auth('MedicationConsumption.GetMedicationScheduleForDay'), controller.getScheduleForDay);
    router.get('/summary-for-day/:patientUserId/:date', auth('MedicationConsumption.GetMedicationConsumptionSummaryForDay'), controller.getSummaryForDay);
    router.get('/summary-for-calendar-months/:patientUserId', auth('MedicationConsumption.GetSummaryByCalendarMonths'), controller.getSummaryByCalendarMonths);
    router.get('/:id', auth('MedicationConsumption.GetById'), controller.getById);

    app.use('/api/v1/clinical/medication-consumptions', router);
};

import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { MedicationConsumptionController } from './medication.consumption.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MedicationConsumptionController();

    router.put('/mark-list-as-taken', auth('Clinical.Medications.MedicationConsumption.MarkListAsTaken'), controller.markListAsTaken);
    router.put('/mark-list-as-missed', auth('Clinical.Medications.MedicationConsumption.MarkListAsMissed'), controller.markListAsMissed);
    router.put('/mark-as-taken/:id', auth('Clinical.Medications.MedicationConsumption.MarkAsTaken'), controller.markAsTaken);
    router.put('/mark-as-missed/:id', auth('Clinical.Medications.MedicationConsumption.MarkAsMissed'), controller.markAsMissed);

    router.post('/delete-future-schedules/:medicationId', auth('Clinical.Medications.MedicationConsumption.DeleteFutureMedicationSchedules'), controller.deleteFutureMedicationSchedules);

    router.get('/search-for-patient/:patientUserId', auth('Clinical.Medications.MedicationConsumption.Search'), controller.searchForPatient);
    router.get('/schedule-for-duration/:patientUserId', auth('Clinical.Medications.MedicationConsumption.GetMedicationSchedule'), controller.getScheduleForDuration);
    router.get('/schedule-for-day/:patientUserId/:date', auth('Clinical.Medications.MedicationConsumption.GetMedicationScheduleForDay'), controller.getScheduleForDay);
    router.get('/summary-for-day/:patientUserId/:date', auth('Clinical.Medications.MedicationConsumption.GetMedicationConsumptionSummaryForDay'), controller.getSummaryForDay);
    router.get('/summary-for-calendar-months/:patientUserId', auth('Clinical.Medications.MedicationConsumption.GetSummaryByCalendarMonths'), controller.getSummaryByCalendarMonths);
    router.get('/:id', auth('Clinical.Medications.MedicationConsumption.GetById'), controller.getById);

    app.use('/api/v1/clinical/medication-consumptions', router);
};

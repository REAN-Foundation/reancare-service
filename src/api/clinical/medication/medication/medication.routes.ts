import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { MedicationController } from './medication.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MedicationController();

    router.get('/time-schedules', auth('Clinical.Medications.Medication.GetTimeSchedules', true), controller.getTimeSchedules);
    router.get('/frequency-units', auth('Clinical.Medications.Medication.GetFrequencyUnits', true), controller.getFrequencyUnits);
    router.get('/dosage-units', auth('Clinical.Medications.Medication.GetDosageUnits', true), controller.getDosageUnits);
    router.get('/duration-units', auth('Clinical.Medications.Medication.GetDurationUnits', true), controller.getDurationUnits);
    router.get('/administration-routes', auth('Clinical.Medications.Medication.GetAdministrationRoutes', true), controller.getAdministrationRoutes);

    router.get('/stock-images', auth('Clinical.Medications.Medication.GetStockMedicationImages'), controller.getStockMedicationImages);
    router.get('/stock-images/:imageId/download', auth('Clinical.Medications.Medication.DownloadStockMedicationImageById'), controller.downloadStockMedicationImageById);
    router.get('/stock-images/:imageId', auth('Clinical.Medications.Medication.GetStockMedicationImageById'), controller.getStockMedicationImageById);

    router.post('/', auth('Clinical.Medications.Medication.Create'), controller.create);
    router.get('/search', auth('Clinical.Medications.Medication.Search'), controller.search);
    router.get('/current/:patientUserId', auth('Clinical.Medications.Medication.GetCurrentMedications'), controller.getCurrentMedications);
    router.get('/:id', auth('Clinical.Medications.Medication.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Medications.Medication.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Medications.Medication.Delete'), controller.delete);

    app.use('/api/v1/clinical/medications', router);
};

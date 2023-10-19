import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { MedicationController } from './medication.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MedicationController();

    router.get('/time-schedules', auth('Medication.GetTimeSchedules', true), controller.getTimeSchedules);
    router.get('/frequency-units', auth('Medication.GetFrequencyUnits', true), controller.getFrequencyUnits);
    router.get('/dosage-units', auth('Medication.GetDosageUnits', true), controller.getDosageUnits);
    router.get('/duration-units', auth('Medication.GetDurationUnits', true), controller.getDurationUnits);
    router.get('/administration-routes', auth('Medication.GetAdministrationRoutes', true), controller.getAdministrationRoutes);

    router.get('/stock-images', auth('Medication.GetStockMedicationImages'), controller.getStockMedicationImages);
    router.get('/stock-images/:imageId/download', auth('Medication.DownloadStockMedicationImageById'), controller.downloadStockMedicationImageById);
    router.get('/stock-images/:imageId', auth('Medication.GetStockMedicationImageById'), controller.getStockMedicationImageById);

    router.post('/', auth('Medication.Create'), controller.create);
    router.get('/search', auth('Medication.Search'), controller.search);
    router.get('/current/:patientUserId', auth('Medication.GetCurrentMedications'), controller.getCurrentMedications);
    router.get('/:id', auth('Medication.GetById'), controller.getById);
    router.put('/:id', auth('Medication.Update'), controller.update);
    router.delete('/:id', auth('Medication.Delete'), controller.delete);

    app.use('/api/v1/clinical/medications', router);
};

import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { MedicationController } from './medication.controller';
import { MedicationAuth } from './medication.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MedicationController();

    router.get('/time-schedules', auth(MedicationAuth.getTimeSchedules), controller.getTimeSchedules);
    router.get('/frequency-units', auth(MedicationAuth.getFrequencyUnits), controller.getFrequencyUnits);
    router.get('/dosage-units', auth(MedicationAuth.getDosageUnits), controller.getDosageUnits);
    router.get('/duration-units', auth(MedicationAuth.getDurationUnits), controller.getDurationUnits);
    router.get('/administration-routes', auth(MedicationAuth.getAdministrationRoutes), controller.getAdministrationRoutes);

    router.get('/stock-images', auth(MedicationAuth.getStockMedicationImages), controller.getStockMedicationImages);
    router.get('/stock-images/:imageId/download', auth(MedicationAuth.downloadStockMedicationImageById), controller.downloadStockMedicationImageById);
    router.get('/stock-images/:imageId', auth(MedicationAuth.getStockMedicationImageById), controller.getStockMedicationImageById);

    router.post('/', auth(MedicationAuth.create), controller.create);
    router.get('/search', auth(MedicationAuth.search), controller.search);
    router.get('/current/:patientUserId', auth(MedicationAuth.getCurrentMedications), controller.getCurrentMedications);
    router.get('/:id', auth(MedicationAuth.getById), controller.getById);
    router.put('/:id', auth(MedicationAuth.update), controller.update);
    router.delete('/:id', auth(MedicationAuth.delete), controller.delete);

    app.use('/api/v1/clinical/medications', router);
};

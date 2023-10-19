import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { MedicationController } from './medication.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MedicationController();

    router.get('/time-schedules', controller.getTimeSchedules);
    router.get('/frequency-units', controller.getFrequencyUnits);
    router.get('/dosage-units', controller.getDosageUnits);
    router.get('/duration-units', controller.getDurationUnits);
    router.get('/administration-routes', controller.getAdministrationRoutes);

    router.get('/stock-images', auth(), controller.getStockMedicationImages);
    router.get('/stock-images/:imageId/download', auth(), controller.downloadStockMedicationImageById);
    router.get('/stock-images/:imageId', auth(), controller.getStockMedicationImageById);

    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/current/:patientUserId', auth(), controller.getCurrentMedications);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/clinical/medications', router);
};

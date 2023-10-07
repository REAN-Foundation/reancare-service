import express from 'express';
import { Loader } from '../../../../startup/loader';
import { MedicationController } from './medication.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new MedicationController();

    router.get('/time-schedules', controller.getTimeSchedules);
    router.get('/frequency-units', controller.getFrequencyUnits);
    router.get('/dosage-units', controller.getDosageUnits);
    router.get('/duration-units', controller.getDurationUnits);
    router.get('/administration-routes', controller.getAdministrationRoutes);

    router.get('/stock-images', authenticator.authenticateUser, controller.getStockMedicationImages);
    router.get('/stock-images/:imageId/download', authenticator.authenticateUser, controller.downloadStockMedicationImageById);
    router.get('/stock-images/:imageId', authenticator.authenticateUser, controller.getStockMedicationImageById);

    router.post('/', authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateUser, controller.search);
    router.get('/current/:patientUserId', authenticator.authenticateUser, controller.getCurrentMedications);
    router.get('/:id', authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/clinical/medications', router);
};

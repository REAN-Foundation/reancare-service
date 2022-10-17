import express from 'express';
import { Loader } from '../../../../startup/loader';
import { MedicationController } from './medication.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new MedicationController();

    router.get('/time-schedules', authenticator.authenticateClient, controller.getTimeSchedules);
    router.get('/frequency-units', authenticator.authenticateClient, controller.getFrequencyUnits);
    router.get('/dosage-units', authenticator.authenticateClient, controller.getDosageUnits);
    router.get('/duration-units', authenticator.authenticateClient, controller.getDurationUnits);
    router.get('/administration-routes', authenticator.authenticateClient, controller.getAdministrationRoutes);

    router.get('/stock-images', authenticator.authenticateClient, authenticator.authenticateUser, controller.getStockMedicationImages);
    router.get('/stock-images/:imageId/download', authenticator.authenticateClient, authenticator.authenticateUser, controller.downloadStockMedicationImageById);
    router.get('/stock-images/:imageId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getStockMedicationImageById);

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/current/:patientUserId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getCurrentMedications);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/clinical/medications', router);
};

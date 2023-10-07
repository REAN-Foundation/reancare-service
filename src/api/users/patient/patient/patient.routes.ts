import express from 'express';
import { Loader } from '../../../../startup/loader';
import { PatientController } from './patient.controller';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new PatientController();

    router.post('/', controller.create);
    router.get('/search', authenticator.authenticateUser, controller.search);
    router.get('/byPhone', authenticator.authenticateUser, controller.getPatientByPhone);
    router.get('/by-phone', authenticator.authenticateUser, controller.getPatientByPhone);
    router.get('/:userId', authenticator.authenticateUser, controller.getByUserId);
    router.put('/:userId', authenticator.authenticateUser, controller.updateByUserId);
    router.delete('/:userId', authenticator.authenticateUser, controller.deleteByUserId);

    app.use('/api/v1/patients', router);
};

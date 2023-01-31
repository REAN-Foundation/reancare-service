import express from 'express';
import { Loader } from '../../../../startup/loader';
import { PatientController } from './patient.controller';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new PatientController();

    router.post('/', authenticator.authenticateClient, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/byPhone', authenticator.authenticateClient, authenticator.authenticateUser, controller.getPatientByPhone);
    router.get('/:userId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getByUserId);
    router.put('/:userId', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateByUserId);
    router.delete('/:userId', authenticator.authenticateClient, authenticator.authenticateUser, controller.deleteByUserId);

    app.use('/api/v1/patients', router);
};

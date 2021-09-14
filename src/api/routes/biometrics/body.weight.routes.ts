/* eslint-disable max-len */
import express from 'express';
import { BodyWeightController } from '../../controllers/biometrics/body.weight.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new BodyWeightController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);

    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);

    router.get('/by-patient/:patientUserId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getByPatientUserId);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);

    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);
    
    app.use('/api/v1/biometrics/body-weight', router);
};

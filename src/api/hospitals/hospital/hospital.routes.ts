import express from 'express';
import { HospitalController } from './hospital.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new HospitalController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/health-systems/:healthSystemId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getHospitalsForHealthSystem);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/hospitals', router);
};

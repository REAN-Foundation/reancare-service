import express from 'express';
import { Loader } from '../../../../startup/loader';
import { EmergencyContactController } from './emergency.contact.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new EmergencyContactController();

    router.get('/roles', authenticator.authenticateClient, authenticator.authenticateUser, controller.getContactRoles);
    router.get('/health-systems', authenticator.authenticateClient,
        authenticator.authenticateUser,controller.getHealthSystems);
    router.get('/health-systems/:healthSystemId', authenticator.authenticateClient,
        authenticator.authenticateUser,controller.getHealthSystemHospitals);
    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/patient-emergency-contacts', router);
};

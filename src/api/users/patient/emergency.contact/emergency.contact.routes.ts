import express from 'express';
import { Loader } from '../../../../startup/loader';
import { EmergencyContactController } from './emergency.contact.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new EmergencyContactController();

    router.get('/roles', authenticator.authenticateUser, controller.getContactRoles);
    router.get('/health-systems', authenticator.authenticateUser,controller.getHealthSystems);
    router.get('/health-systems/:healthSystemId', authenticator.authenticateUser,controller.getHealthSystemHospitals);
    router.post('/', authenticator.authenticateUser, controller.create);
    router.get('/search', authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/patient-emergency-contacts', router);
};

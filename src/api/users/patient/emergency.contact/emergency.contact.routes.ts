import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { EmergencyContactController } from './emergency.contact.controller';
import { EmergencyContactAuth } from './emergency.contact.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new EmergencyContactController();

    router.get('/roles', auth(EmergencyContactAuth.getContactRoles), controller.getContactRoles);

    router.get('/health-systems', auth(EmergencyContactAuth.getHealthSystems), controller.getHealthSystems);
    router.get('/health-systems/:healthSystemId', auth(EmergencyContactAuth.getHealthSystemHospitals), controller.getHealthSystemHospitals);

    router.post('/', auth(EmergencyContactAuth.create), controller.create);
    router.get('/search', auth(EmergencyContactAuth.search), controller.search);
    router.get('/:id', auth(EmergencyContactAuth.getById), controller.getById);
    router.put('/:id', auth(EmergencyContactAuth.update), controller.update);
    router.delete('/:id', auth(EmergencyContactAuth.delete), controller.delete);

    app.use('/api/v1/patient-emergency-contacts', router);
};

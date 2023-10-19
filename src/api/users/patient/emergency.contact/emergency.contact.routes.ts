import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { EmergencyContactController } from './emergency.contact.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new EmergencyContactController();

    router.get('/roles', auth(), controller.getContactRoles);
    router.get('/health-systems', auth(),controller.getHealthSystems);
    router.get('/health-systems/:healthSystemId', auth(),controller.getHealthSystemHospitals);
    router.post('/', auth(), controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/patient-emergency-contacts', router);
};

import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { EmergencyContactController } from './emergency.contact.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new EmergencyContactController();

    router.get('/roles', auth('Emergency.Contact.GetContactRoles', true), controller.getContactRoles);
    router.get('/health-systems', auth('Emergency.Contact.GetHealthSystems'), controller.getHealthSystems);
    router.get('/health-systems/:healthSystemId', auth('Emergency.Contact.GetHealthSystemHospitals'), controller.getHealthSystemHospitals);
    router.post('/', auth('Emergency.Contact.Create'), controller.create);
    router.get('/search', auth('Emergency.Contact.Search'), controller.search);
    router.get('/:id', auth('Emergency.Contact.GetById'), controller.getById);
    router.put('/:id', auth('Emergency.Contact.Update'), controller.update);
    router.delete('/:id', auth('Emergency.Contact.Delete'), controller.delete);

    app.use('/api/v1/patient-emergency-contacts', router);
};

import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { EmergencyContactController } from './emergency.contact.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new EmergencyContactController();

    router.get('/roles', auth('User.Patient.EmergencyContact.GetContactRoles', true), controller.getContactRoles);

    router.get('/health-systems', auth('User.Patient.EmergencyContact.GetHealthSystems'), controller.getHealthSystems);
    router.get('/health-systems/:healthSystemId', auth('User.Patient.EmergencyContact.GetHealthSystemHospitals'), controller.getHealthSystemHospitals);

    router.post('/', auth('User.Patient.EmergencyContact.Create'), controller.create);
    router.get('/search', auth('User.Patient.EmergencyContact.Search'), controller.search);
    router.get('/:id', auth('User.Patient.EmergencyContact.GetById'), controller.getById);
    router.put('/:id', auth('User.Patient.EmergencyContact.Update'), controller.update);
    router.delete('/:id', auth('User.Patient.EmergencyContact.Delete'), controller.delete);

    app.use('/api/v1/patient-emergency-contacts', router);
};

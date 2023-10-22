import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { EmergencyContactController } from './emergency.contact.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new EmergencyContactController();

    router.get('/roles', auth('Users.Patients.EmergencyContact.GetContactRoles', true), controller.getContactRoles);
    router.get('/health-systems', auth('Users.Patients.EmergencyContact.GetHealthSystems'), controller.getHealthSystems);
    router.get('/health-systems/:healthSystemId', auth('Users.Patients.EmergencyContact.GetHealthSystemHospitals'), controller.getHealthSystemHospitals);
    router.post('/', auth('Users.Patients.EmergencyContact.Create'), controller.create);
    router.get('/search', auth('Users.Patients.EmergencyContact.Search'), controller.search);
    router.get('/:id', auth('Users.Patients.EmergencyContact.GetById'), controller.getById);
    router.put('/:id', auth('Users.Patients.EmergencyContact.Update'), controller.update);
    router.delete('/:id', auth('Users.Patients.EmergencyContact.Delete'), controller.delete);

    app.use('/api/v1/patient-emergency-contacts', router);
};

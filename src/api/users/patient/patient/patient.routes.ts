import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { PatientController } from './patient.controller';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new PatientController();

    router.post('/', auth('Users.Patients.Patient.Create', true), controller.create);
    router.get('/search', auth('Users.Patients.Patient.Search'), controller.search);
    router.get('/byPhone', auth('Users.Patients.Patient.GetPatientByPhone'), controller.getPatientByPhone);
    router.get('/:tenantId/by-phone/:phone', auth('Users.Patients.Patient.GetByPhone'), controller.getByPhone);
    router.get('/:userId', auth('Users.Patients.Patient.GetByUserId'), controller.getByUserId);
    router.put('/:userId', auth('Users.Patients.Patient.UpdateByUserId'), controller.updateByUserId);
    router.delete('/:userId', auth('Users.Patients.Patient.DeleteByUserId'), controller.deleteByUserId);

    app.use('/api/v1/patients', router);
};

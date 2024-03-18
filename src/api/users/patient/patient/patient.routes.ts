import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { PatientController } from './patient.controller';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new PatientController();

    router.post('/', auth('User.Patient.Patient.Create', true), controller.create);
    router.get('/search', auth('User.Patient.Patient.Search'), controller.search);
    router.get('/byPhone', auth('User.Patient.Patient.GetPatientByPhone'), controller.getPatientByPhone);
    router.get('/:tenantId/by-phone/:phone', auth('User.Patient.Patient.GetByPhone'), controller.getByPhone);
    router.get('/:userId', auth('User.Patient.Patient.GetByUserId', true), controller.getByUserId);
    router.put('/:userId', auth('User.Patient.Patient.UpdateByUserId'), controller.updateByUserId);
    router.delete('/:userId', auth('User.Patient.Patient.DeleteByUserId'), controller.deleteByUserId);

    app.use('/api/v1/patients', router);
};

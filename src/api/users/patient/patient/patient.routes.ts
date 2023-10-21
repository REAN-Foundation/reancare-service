import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { PatientController } from './patient.controller';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new PatientController();

    router.post('/', auth('Patient.Create', true), controller.create);
    router.get('/search', auth('Patient.Search'), controller.search);
    router.get('/byPhone', auth('Patient.GetPatientByPhone'), controller.getPatientByPhone);
    router.get('/:tenantId/by-phone/:phone', auth('Patient.GetByPhone'), controller.getByPhone);
    router.get('/:userId', auth('Patient.GetByUserId'), controller.getByUserId);
    router.put('/:userId', auth('Patient.UpdateByUserId'), controller.updateByUserId);
    router.delete('/:userId', auth('Patient.DeleteByUserId'), controller.deleteByUserId);

    app.use('/api/v1/patients', router);
};

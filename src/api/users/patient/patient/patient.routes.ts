import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { PatientController } from './patient.controller';
import { PatientAuth } from './patient.auth';

///////////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new PatientController();

    router.post('/', auth(PatientAuth.create), controller.create);
    router.get('/search', auth(PatientAuth.search), controller.search);
    router.put('/:userId', auth(PatientAuth.updateByUserId), controller.updateByUserId);
    router.delete('/:userId', auth(PatientAuth.deleteByUserId), controller.deleteByUserId);

    //To be deprecated
    router.get('/byPhone', auth(PatientAuth.getPatientByPhone), controller.getPatientByPhone);

    router.get('/by-phone/:phone', auth(PatientAuth.getByPhone), controller.getByPhone);
    router.get('/:userId', auth(PatientAuth.getByUserId), controller.getByUserId);

    app.use('/api/v1/patients', router);
};

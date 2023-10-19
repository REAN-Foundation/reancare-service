import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { PatientController } from './patient.controller';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new PatientController();

    router.post('/', controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/byPhone', auth(), controller.getPatientByPhone);
    router.get('/:tenantId/by-phone/:phone', auth(), controller.getByPhone);
    router.get('/:userId', auth(), controller.getByUserId);
    router.put('/:userId', auth(), controller.updateByUserId);
    router.delete('/:userId', auth(), controller.deleteByUserId);

    app.use('/api/v1/patients', router);
};

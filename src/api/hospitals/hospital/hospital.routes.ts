import express from 'express';
import { HospitalController } from './hospital.controller';
import { auth } from '../../../auth/auth.handler';
import { HospitalAuth } from './hospital.auth';
///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();

    const controller = new HospitalController();

    router.post('/', auth(HospitalAuth.create), controller.create);
    router.get('/health-systems/:healthSystemId', auth(HospitalAuth.getHospitalsForHealthSystem), controller.getHospitalsForHealthSystem);
    router.get('/search', auth(HospitalAuth.search), controller.search);
    router.get('/:id', auth(HospitalAuth.getById), controller.getById);
    router.put('/:id', auth(HospitalAuth.update), controller.update);
    router.delete('/:id', auth(HospitalAuth.delete), controller.delete);

    app.use('/api/v1/hospitals', router);
};

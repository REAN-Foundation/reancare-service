import express from 'express';
import { HospitalController } from './hospital.controller';
import { auth } from '../../../auth/auth.handler';
///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();

    const controller = new HospitalController();

    router.post('/', auth('Hospital.Create'), controller.create);
    router.get('/health-systems/:healthSystemId', auth('Hospital.GetHospitalsForHealthSystem'), controller.getHospitalsForHealthSystem);
    router.get('/search', auth('Hospital.Search'), controller.search);
    router.get('/:id', auth('Hospital.GetById'), controller.getById);
    router.put('/:id', auth('Hospital.Update'), controller.update);
    router.delete('/:id', auth('Hospital.Delete'), controller.delete);

    app.use('/api/v1/hospitals', router);
};

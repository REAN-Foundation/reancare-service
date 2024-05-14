import express from 'express';
import { DoctorController } from './doctor.controller';
import { auth } from '../../../auth/auth.handler';
import { DoctorAuth } from './doctor.auth';

///////////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DoctorController();

    router.post('/', auth(DoctorAuth.create), controller.create);
    router.get('/search', auth(DoctorAuth.search), controller.search);
    router.get('/:userId', auth(DoctorAuth.getByUserId), controller.getByUserId);
    router.put('/:userId', auth(DoctorAuth.updateByUserId), controller.updateByUserId);
    router.delete('/:userId', auth(DoctorAuth.deleteByUserId), controller.deleteByUserId);

    app.use('/api/v1/doctors', router);
};

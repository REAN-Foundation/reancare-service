import express from 'express';
import { DoctorController } from './doctor.controller';
import { auth } from '../../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DoctorController();

    router.post('/', controller.create);
    router.get('/search', auth(), controller.search);
    router.get('/:userId', auth(), controller.getByUserId);
    router.put('/:userId', auth(), controller.updateByUserId);

    app.use('/api/v1/doctors', router);
};

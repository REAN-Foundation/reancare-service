import express from 'express';
import { DoctorController } from './doctor.controller';
import { auth } from '../../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DoctorController();

    router.post('/', auth('User.Doctor.Create', true), controller.create);
    router.get('/search', auth('User.Doctor.Search'), controller.search);
    router.get('/:userId', auth('User.Doctor.GetByUserId'), controller.getByUserId);
    router.put('/:userId', auth('User.Doctor.UpdateByUserId'), controller.updateByUserId);
    router.delete('/:userId', auth('User.Doctor.DeleteByUserId'), controller.deleteByUserId);

    app.use('/api/v1/doctors', router);
};

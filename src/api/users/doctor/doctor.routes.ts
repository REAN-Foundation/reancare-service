import express from 'express';
import { DoctorController } from './doctor.controller';
import { auth } from '../../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DoctorController();

    router.post('/', auth('Users.Doctor.Create', true), controller.create);
    router.get('/search', auth('Users.Doctor.Search'), controller.search);
    router.get('/:userId', auth('Users.Doctor.GetByUserId'), controller.getByUserId);
    router.put('/:userId', auth('Users.Doctor.UpdateByUserId'), controller.updateByUserId);
    router.delete('/:userId', auth('Users.Doctor.DeleteByUserId'), controller.deleteByUserId);

    app.use('/api/v1/doctors', router);
};

import express from 'express';
import { DoctorController } from './doctor.controller';
import { auth } from '../../../auth/auth.handler';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DoctorController();

    router.post('/', auth('Doctor.Create', true), controller.create);
    router.get('/search', auth('Doctor.Search'), controller.search);
    router.get('/:userId', auth('Doctor.GetByUserId'), controller.getByUserId);
    router.put('/:userId', auth('Doctor.UpdateByUserId'), controller.updateByUserId);
    router.delete('/:userId', auth('Doctor.DeleteByUserId'), controller.deleteByUserId);

    app.use('/api/v1/doctors', router);
};

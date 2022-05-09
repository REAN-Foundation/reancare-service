import express from 'express';
import { DoctorController } from '../controllers/doctor.controller';
import { Loader } from '../../startup/loader';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new DoctorController();

    router.post('/', authenticator.authenticateClient, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:userId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getByUserId);
    // eslint-disable-next-line max-len
    //router.put('/:userId', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateByUserId);
    
    app.use('/api/v1/doctors', router);
};

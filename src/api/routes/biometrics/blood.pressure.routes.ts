import express from 'express';
import { BloodPressureController } from '../../controllers/biometrics/blood.pressure.controller';
import { Loader } from '../../../startup/loader';
 
///////////////////////////////////////////////////////////////////////////////////
 
export const register = (app: express.Application): void => {
 
    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new BloodPressureController();
 
    router.post('/', authenticator.authenticateClient, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);
 
    app.use('/api/v1/biometrics/blood-pressure', router);
};

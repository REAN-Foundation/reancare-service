import express from 'express';
import { Loader } from '../../../startup/loader';
import { CareplanController } from '../../controllers/careplan/careplan.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new CareplanController();

    router.get('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.getAvailableCareplans);
    router.post('/:patientUserId/enroll', authenticator.authenticateClient, authenticator.authenticateUser, controller.enroll);
    
    app.use('/api/v1/care-plans', router);
};

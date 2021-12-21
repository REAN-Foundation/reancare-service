import express from 'express';
import { Loader } from '../../../startup/loader';
import { CareplanController } from '../../controllers/careplan/careplan.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new CareplanController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.enrollPatient);
    
    app.use('/api/v1/careplan/enrollments', router);
};

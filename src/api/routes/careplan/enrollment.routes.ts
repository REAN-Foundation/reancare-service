import express from 'express';
import { Loader } from '../../../startup/loader';
import { EnrollmentController } from '../../controllers/careplan/enrollment.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new EnrollmentController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    
    app.use('/api/v1/careplan/enrollments', router);
};

import express from 'express';
import { VolunteerController } from './volunteer.controller';
import { Loader } from '../../../startup/loader';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new VolunteerController();

    router.post('/', controller.create);
    router.get('/search', authenticator.authenticateUser, controller.search);
    router.get('/:userId', authenticator.authenticateUser, controller.getByUserId);
    router.put('/:userId', authenticator.authenticateUser, controller.updateByUserId);
    router.delete('/:userId', authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/volunteers', router);
};

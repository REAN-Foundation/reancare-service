import express from 'express';
import { VolunteerController } from './volunteer.controller';
import { Loader } from '../../../startup/loader';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new VolunteerController();

    router.post('/', authenticator.authenticateClient, controller.create);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:userId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getByUserId);
    router.put('/:userId', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateByUserId);
    router.delete('/:userId', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/volunteers', router);
};

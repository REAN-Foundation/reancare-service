import express from 'express';
import { Loader } from '../../../startup/loader';
import { CustomQueryController } from './custom.query.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new CustomQueryController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.executeQuery);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/custom-query', router);
};

import express from 'express';
import { ConsentController } from './consent.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new ConsentController();

    router.post('/', authenticator.authenticateUser, controller.create);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);
    router.get('/search', authenticator.authenticateUser, controller.search);

    router.get('/:id', authenticator.authenticateUser, controller.getById);

    app.use('/api/v1/consents', router);
};

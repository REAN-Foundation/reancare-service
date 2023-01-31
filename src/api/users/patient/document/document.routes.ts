import express from 'express';
import { Loader } from '../../../../startup/loader';
import { DocumentController } from './document.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new DocumentController();

    router.get('/types', authenticator.authenticateClient, authenticator.authenticateUser, controller.getTypes);
    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.upload);
    router.put('/:id/rename', authenticator.authenticateClient, authenticator.authenticateUser, controller.rename);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);

    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id/download', authenticator.authenticateClient, authenticator.authenticateUser, controller.download);
    router.get('/:id/share', authenticator.authenticateClient, authenticator.authenticateUser, controller.share);

    router.get('/:id/', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/patient-documents', router);
};

export const registerSharingRoutes = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DocumentController();
    router.get('/:key', controller.getSharedDocument);
    app.use('/api/v1/docs', router);
};

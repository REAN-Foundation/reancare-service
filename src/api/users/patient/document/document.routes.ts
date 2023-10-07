import express from 'express';
import { Loader } from '../../../../startup/loader';
import { DocumentController } from './document.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new DocumentController();

    router.get('/types', authenticator.authenticateUser, controller.getTypes);
    router.post('/', authenticator.authenticateUser, controller.upload);
    router.put('/:id/rename', authenticator.authenticateUser, controller.rename);
    router.put('/:id', authenticator.authenticateUser, controller.update);

    router.get('/search', authenticator.authenticateUser, controller.search);
    router.get('/:id/download', authenticator.authenticateUser, controller.download);
    router.get('/:id/share', authenticator.authenticateUser, controller.share);

    router.get('/:id/', authenticator.authenticateUser, controller.getById);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);

    app.use('/api/v1/patient-documents', router);
};

export const registerSharingRoutes = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DocumentController();
    router.get('/:key', controller.getSharedDocument);
    app.use('/api/v1/docs', router);
};

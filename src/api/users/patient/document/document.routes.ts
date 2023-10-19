import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { DocumentController } from './document.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DocumentController();

    router.get('/types', auth(), controller.getTypes);
    router.post('/', auth(), controller.upload);
    router.put('/:id/rename', auth(), controller.rename);
    router.put('/:id', auth(), controller.update);

    router.get('/search', auth(), controller.search);
    router.get('/:id/download', auth(), controller.download);
    router.get('/:id/share', auth(), controller.share);

    router.get('/:id/', auth(), controller.getById);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/patient-documents', router);
};

export const registerSharingRoutes = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DocumentController();
    router.get('/:key', controller.getSharedDocument);
    app.use('/api/v1/docs', router);
};

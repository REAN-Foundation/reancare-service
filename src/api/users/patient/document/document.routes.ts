import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { DocumentController } from './document.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DocumentController();

    router.get('/types', auth('User.Patient.Document.GetTypes', true), controller.getTypes);
    router.post('/', auth('User.Patient.Document.Upload'), controller.upload);
    router.put('/:id/rename', auth('User.Patient.Document.Rename'), controller.rename);
    router.put('/:id', auth('User.Patient.Document.Update'), controller.update);

    router.get('/search', auth('User.Patient.Document.Search'), controller.search);
    router.get('/:id/download', auth('User.Patient.Document.Download'), controller.download);
    router.get('/:id/share', auth('User.Patient.Document.Share'), controller.share);

    router.get('/:id/', auth('User.Patient.Document.GetById'), controller.getById);
    router.delete('/:id', auth('User.Patient.Document.Delete'), controller.delete);

    app.use('/api/v1/patient-documents', router);
};

export const registerSharingRoutes = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DocumentController();
    router.get('/:key', controller.getSharedDocument);
    app.use('/api/v1/docs', router);
};

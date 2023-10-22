import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { DocumentController } from './document.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DocumentController();

    router.get('/types', auth('Users.Patients.Document.GetTypes', true), controller.getTypes);
    router.post('/', auth('Users.Patients.Document.Upload'), controller.upload);
    router.put('/:id/rename', auth('Users.Patients.Document.Rename'), controller.rename);
    router.put('/:id', auth('Users.Patients.Document.Update'), controller.update);

    router.get('/search', auth('Users.Patients.Document.Search'), controller.search);
    router.get('/:id/download', auth('Users.Patients.Document.Download'), controller.download);
    router.get('/:id/share', auth('Users.Patients.Document.Share'), controller.share);

    router.get('/:id/', auth('Users.Patients.Document.GetById'), controller.getById);
    router.delete('/:id', auth('Users.Patients.Document.Delete'), controller.delete);

    app.use('/api/v1/patient-documents', router);
};

export const registerSharingRoutes = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DocumentController();
    router.get('/:key', controller.getSharedDocument);
    app.use('/api/v1/docs', router);
};

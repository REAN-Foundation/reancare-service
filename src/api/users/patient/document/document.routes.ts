import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { DocumentController } from './document.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DocumentController();

    router.get('/types', auth('PatientDocument.GetTypes', true), controller.getTypes);
    router.post('/', auth('PatientDocument.Upload'), controller.upload);
    router.put('/:id/rename', auth('PatientDocument.Rename'), controller.rename);
    router.put('/:id', auth('PatientDocument.Update'), controller.update);

    router.get('/search', auth('PatientDocument.Search'), controller.search);
    router.get('/:id/download', auth('PatientDocument.Download'), controller.download);
    router.get('/:id/share', auth('PatientDocument.Share'), controller.share);

    router.get('/:id/', auth('PatientDocument.GetById'), controller.getById);
    router.delete('/:id', auth('PatientDocument.Delete'), controller.delete);

    app.use('/api/v1/patient-documents', router);
};

export const registerSharingRoutes = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DocumentController();
    router.get('/:key', controller.getSharedDocument);
    app.use('/api/v1/docs', router);
};

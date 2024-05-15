import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { DocumentController } from './document.controller';
import { PatientDocumentAuth } from './document.auth';
import { fileUploadMiddleware } from '../../../../middlewares/file.upload.middleware';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DocumentController();
    fileUploadMiddleware(router);
    
    router.get('/types', auth(PatientDocumentAuth.getTypes), controller.getTypes);
    router.post('/', auth(PatientDocumentAuth.upload), controller.upload);
    router.put('/:id/rename', auth(PatientDocumentAuth.rename), controller.rename);
    router.put('/:id', auth(PatientDocumentAuth.update), controller.update);

    router.get('/search', auth(PatientDocumentAuth.search), controller.search);
    router.get('/:id/download', auth(PatientDocumentAuth.download), controller.download);
    router.get('/:id/share', auth(PatientDocumentAuth.share), controller.share);

    router.get('/:id/', auth(PatientDocumentAuth.getById), controller.getById);
    router.delete('/:id', auth(PatientDocumentAuth.delete), controller.delete);

    app.use('/api/v1/patient-documents', router);
};

///////////////////////////////////////////////////////////////////////////////////

export const registerSharingRoutes = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DocumentController();
    router.get('/:key', auth(PatientDocumentAuth.getSharedDocument) ,controller.getSharedDocument);
    app.use('/api/v1/docs', router);
};

///////////////////////////////////////////////////////////////////////////////////

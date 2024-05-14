import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { LabRecordController } from './lab.record.controller';
import { LabRecordAuth } from './lab.record.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new LabRecordController();

    router.post('/', auth(LabRecordAuth.create), controller.create);
    router.get('/search', auth(LabRecordAuth.search), controller.search);
    router.get('/:id', auth(LabRecordAuth.getById), controller.getById);
    router.put('/:id', auth(LabRecordAuth.update), controller.update);
    router.delete('/:id', auth(LabRecordAuth.delete), controller.delete);

    app.use('/api/v1/clinical/lab-records', router);
};

import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { LabRecordController } from './lab.record.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new LabRecordController();

    router.post('/', auth('LabRecord.Create'), controller.create);
    router.get('/search', auth('LabRecord.Search'), controller.search);
    router.get('/:id', auth('LabRecord.GetById'), controller.getById);
    router.put('/:id', auth('LabRecord.Update'), controller.update);
    router.delete('/:id', auth('LabRecord.Delete'), controller.delete);

    app.use('/api/v1/clinical/lab-records', router);
};

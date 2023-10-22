import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { LabRecordController } from './lab.record.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new LabRecordController();

    router.post('/', auth('Clinical.LabRecord.Create'), controller.create);
    router.get('/search', auth('Clinical.LabRecord.Search'), controller.search);
    router.get('/:id', auth('Clinical.LabRecord.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.LabRecord.Update'), controller.update);
    router.delete('/:id', auth('Clinical.LabRecord.Delete'), controller.delete);

    app.use('/api/v1/clinical/lab-records', router);
};

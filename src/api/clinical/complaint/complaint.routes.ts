import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { ComplaintController } from './complaint.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ComplaintController();

    router.post('/', auth('Clinical.Complaint.Create'), controller.create);
    router.get('/search/:id', auth('Clinical.Complaint.Search'), controller.search);
    router.get('/:id', auth('Clinical.Complaint.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Complaint.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Complaint.Delete'), controller.delete);

    app.use('/api/v1/clinical/complaints', router);
};

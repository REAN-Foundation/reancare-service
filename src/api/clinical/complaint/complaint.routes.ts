import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { ComplaintController } from './complaint.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new ComplaintController();

    router.post('/', auth('Complaint.Create'), controller.create);
    router.get('/search/:id', auth('Complaint.Search'), controller.search);
    router.get('/:id', auth('Complaint.GetById'), controller.getById);
    router.put('/:id', auth('Complaint.Update'), controller.update);
    router.delete('/:id', auth('Complaint.Delete'), controller.delete);

    app.use('/api/v1/clinical/complaints', router);
};

import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { DrugController } from './drug.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DrugController();

    router.post('/', auth('Clinical.Medications.Drug.Create'), controller.create);
    router.get('/search', auth('Clinical.Medications.Drug.Search'), controller.search);
    router.get('/:id', auth('Clinical.Medications.Drug.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Medications.Drug.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Medications.Drug.Delete'), controller.delete);

    app.use('/api/v1/clinical/drugs', router);
};

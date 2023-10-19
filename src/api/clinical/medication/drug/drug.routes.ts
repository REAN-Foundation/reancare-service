import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { DrugController } from './drug.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new DrugController();

    router.post('/', auth('Medication.Drug.Create'), controller.create);
    router.get('/search', auth('Medication.Drug.Search'), controller.search);
    router.get('/:id', auth('Medication.Drug.GetById'), controller.getById);
    router.put('/:id', auth('Medication.Drug.Update'), controller.update);
    router.delete('/:id', auth('Medication.Drug.Delete'), controller.delete);

    app.use('/api/v1/clinical/drugs', router);
};

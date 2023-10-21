import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { PhysicalActivityController } from './physical.activity.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new PhysicalActivityController();

    router.post('/', auth('Exercise.PhysicalActivity.Create'), controller.create);
    router.get('/search', auth('Exercise.PhysicalActivity.Search'), controller.search);
    router.get('/:id', auth('Exercise.PhysicalActivity.GetById'), controller.getById);
    router.put('/:id', auth('Exercise.PhysicalActivity.Update'), controller.update);
    router.delete('/:id', auth('Exercise.PhysicalActivity.Delete'), controller.delete);

    app.use('/api/v1/wellness/exercise/physical-activities', router);
};

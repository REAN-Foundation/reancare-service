import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { PhysicalActivityController } from './physical.activity.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new PhysicalActivityController();

    router.post('/', auth('Wellness.Exercise.PhysicalActivity.Create'), controller.create);
    router.get('/search', auth('Wellness.Exercise.PhysicalActivity.Search'), controller.search);
    router.get('/:id', auth('Wellness.Exercise.PhysicalActivity.GetById'), controller.getById);
    router.put('/:id', auth('Wellness.Exercise.PhysicalActivity.Update'), controller.update);
    router.delete('/:id', auth('Wellness.Exercise.PhysicalActivity.Delete'), controller.delete);

    app.use('/api/v1/wellness/exercise/physical-activities', router);
};

/* eslint-disable max-len */
import express from 'express';
import { MedicalConditionController } from './medical.condition.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MedicalConditionController();

    router.post('/', auth('MedicalCondition.Create'), controller.create);
    router.get('/search', auth('MedicalCondition.Search'), controller.search);
    router.get('/:id', auth('MedicalCondition.GetById'), controller.getById);
    router.put('/:id', auth('MedicalCondition.Update'), controller.update);
    router.delete('/:id', auth('MedicalCondition.Delete'), controller.delete);

    app.use('/api/v1/static-types/medical-condition', router);
};

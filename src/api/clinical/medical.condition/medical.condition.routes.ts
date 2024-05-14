/* eslint-disable max-len */
import express from 'express';
import { MedicalConditionController } from './medical.condition.controller';
import { auth } from '../../../auth/auth.handler';
import { MedicalConditionAuth } from './medical.condition.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new MedicalConditionController();

    router.post('/', auth(MedicalConditionAuth.create), controller.create);
    router.get('/search', auth(MedicalConditionAuth.search), controller.search);
    router.get('/:id', auth(MedicalConditionAuth.getById), controller.getById);
    router.put('/:id', auth(MedicalConditionAuth.update), controller.update);
    router.delete('/:id', auth(MedicalConditionAuth.delete), controller.delete);

    app.use('/api/v1/static-types/medical-condition', router);
};

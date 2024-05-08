import express from 'express';
import { auth } from '../../../../auth/auth.handler';
import { SymptomTypeController } from '../../../clinical/symptom/symptom.type/symptom.type.controller';
import { SymptomTypeAuth } from './symptom.type.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new SymptomTypeController();

    router.post('/', auth(SymptomTypeAuth.create), controller.create);
    router.get('/search', auth(SymptomTypeAuth.search), controller.search);
    router.get('/:id', auth(SymptomTypeAuth.getById), controller.getById);
    router.put('/:id', auth(SymptomTypeAuth.update), controller.update);
    router.delete('/:id', auth(SymptomTypeAuth.delete), controller.delete);

    app.use('/api/v1/clinical/symptom-types', router);
};

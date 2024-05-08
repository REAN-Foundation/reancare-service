import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { AllergyController } from './allergy.controller';
import { AllergyAuth } from './allergy.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AllergyController();

    router.get('/allergen-categories', auth(AllergyAuth.getAllergenCategories), controller.getAllergenCategories);
    router.get('/allergen-exposure-routes', auth(AllergyAuth.getAllergenExposureRoutes), controller.getAllergenExposureRoutes);

    router.post('/', auth(AllergyAuth.create), controller.create);
    router.get('/for-patient/:patientUserId', auth(AllergyAuth.getForPatient), controller.getForPatient);
    router.get('/search', auth(AllergyAuth.search), controller.search);
    router.get('/:id', auth(AllergyAuth.getById), controller.getById);
    router.put('/:id', auth(AllergyAuth.update), controller.update);
    router.delete('/:id', auth(AllergyAuth.delete), controller.delete);

    app.use('/api/v1/clinical/allergies', router);
};

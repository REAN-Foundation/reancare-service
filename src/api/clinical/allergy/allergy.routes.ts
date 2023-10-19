import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { AllergyController } from './allergy.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AllergyController();

    router.get('/allergen-categories', controller.getAllergenCategories);
    router.get('/allergen-exposure-routes', controller.getAllergenExposureRoutes);

    router.post('/', auth(), controller.create);
    router.get('/for-patient/:patientUserId', auth(), controller.getForPatient);
    router.get('/search', auth(), controller.search);
    router.get('/:id', auth(), controller.getById);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);

    app.use('/api/v1/clinical/allergies', router);
};

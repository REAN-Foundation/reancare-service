import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { AllergyController } from './allergy.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AllergyController();

    router.get('/allergen-categories', auth('Allergy.GetAllergenCategories', true), controller.getAllergenCategories);
    router.get('/allergen-exposure-routes', auth('Allergy.GetAllergenExposureRoutes', true), controller.getAllergenExposureRoutes);

    router.post('/', auth('Allergy.Create'), controller.create);
    router.get('/for-patient/:patientUserId', auth('Allergy.GetForPatient'), controller.getForPatient);
    router.get('/search', auth('Allergy.Search'), controller.search);
    router.get('/:id', auth('Allergy.GetById'), controller.getById);
    router.put('/:id', auth('Allergy.Update'), controller.update);
    router.delete('/:id', auth('Allergy.Delete'), controller.delete);

    app.use('/api/v1/clinical/allergies', router);
};

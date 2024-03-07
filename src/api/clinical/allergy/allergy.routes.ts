import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { AllergyController } from './allergy.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new AllergyController();

    router.get('/allergen-categories', auth('Clinical.Allergy.GetAllergenCategories', true), controller.getAllergenCategories);
    router.get('/allergen-exposure-routes', auth('Clinical.Allergy.GetAllergenExposureRoutes', true), controller.getAllergenExposureRoutes);

    router.post('/', auth('Clinical.Allergy.Create'), controller.create);
    router.get('/for-patient/:patientUserId', auth('Clinical.Allergy.GetForPatient'), controller.getForPatient);
    router.get('/search', auth('Clinical.Allergy.Search'), controller.search);
    router.get('/:id', auth('Clinical.Allergy.GetById'), controller.getById);
    router.put('/:id', auth('Clinical.Allergy.Update'), controller.update);
    router.delete('/:id', auth('Clinical.Allergy.Delete'), controller.delete);

    app.use('/api/v1/clinical/allergies', router);
};

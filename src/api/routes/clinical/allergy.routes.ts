import express from 'express';
import { Loader } from '../../../startup/loader';
import { PatientAllergyController } from '../../controllers/clinical/allergy.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new PatientAllergyController();

    router.get('/allergen-categories', authenticator.authenticateClient, controller.getAllergenCategories);
    router.get('/allergen-exposure-routes', authenticator.authenticateClient, controller.getAllergenExposureRoutes);

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.get('/search/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);
    
    app.use('/api/v1/clinical/allergies', router);
};

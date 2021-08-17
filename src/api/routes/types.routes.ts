import express from 'express';
import { TypesController } from '../controllers/types.controller';
import { Loader } from '../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new TypesController();

    router.get('/person-roles', authenticator.authenticateClient, controller.getPersonRoleTypes);
    router.get('/organizations', authenticator.authenticateClient, controller.getOrganizationTypes);
    router.get('/genders', authenticator.authenticateClient, controller.getGenderTypes);
    
    app.use('/api/v1/types', router);
};

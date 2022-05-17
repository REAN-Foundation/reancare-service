import express from 'express';
import { Loader } from '../../startup/loader';
import { TypesController } from '../controllers/types.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new TypesController();

    router.get('/person-roles', authenticator.authenticateClient, controller.getPersonRoleTypes);
    router.get('/organization-types', authenticator.authenticateClient, controller.getOrganizationTypes);
    router.get('/genders', authenticator.authenticateClient, controller.getGenderTypes);
    router.get('/blood-groups', authenticator.authenticateClient, controller.getBloodGroups);
    router.get('/marital-statuses', authenticator.authenticateClient, controller.getMaritalStatuses);
    router.get('/severities', authenticator.authenticateClient, controller.getSeverities);
    router.get('/priorities', authenticator.authenticateClient, controller.getPriorityTypes);

    app.use('/api/v1/types', router);
};

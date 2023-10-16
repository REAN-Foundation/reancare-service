import express from 'express';
import { CohortController } from './cohort.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new CohortController();

    router.post('/', authenticator.authenticateClient, authenticator.authenticateUser, controller.create);
    router.put('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.delete);
    router.get('/search', authenticator.authenticateClient, authenticator.authenticateUser, controller.search);

    router.get('/:id/stats', authenticator.authenticateClient, authenticator.authenticateUser, controller.getCohortStats);
    router.get('/:id/users', authenticator.authenticateClient, authenticator.authenticateUser, controller.getCohortUsers);
    router.post('/:id/users/:userId/add', authenticator.authenticateClient, authenticator.authenticateUser, controller.addUserToCohort);
    router.post('/:id/users/:userId/remove', authenticator.authenticateClient, authenticator.authenticateUser, controller.removeUserFromCohort);
    router.get('/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getById);
    router.get('/tenants/:tenantId', authenticator.authenticateClient, authenticator.authenticateUser, controller.getCohortsForTenant);

    app.use('/api/v1/cohorts', router);
};

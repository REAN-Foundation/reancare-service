import express from 'express';
import { CohortController } from './cohort.controller';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new CohortController();

    router.post('/', authenticator.authenticateUser, controller.create);
    router.put('/:id', authenticator.authenticateUser, controller.update);
    router.delete('/:id', authenticator.authenticateUser, controller.delete);
    router.get('/search', authenticator.authenticateUser, controller.search);

    router.get('/:id/stats', authenticator.authenticateUser, controller.getCohortStats);
    router.get('/:id/users', authenticator.authenticateUser, controller.getCohortUsers);
    router.post('/:id/users/:userId/add', authenticator.authenticateUser, controller.addUserToCohort);
    router.post('/:id/users/:userId/remove', authenticator.authenticateUser, controller.removeUserFromCohort);
    router.get('/:id', authenticator.authenticateUser, controller.getById);
    router.get('/tenants/:tenantId', authenticator.authenticateUser, controller.getCohortsForTenant);

    app.use('/api/v1/cohorts', router);
};

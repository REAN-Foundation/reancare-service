import express from 'express';
import { CohortController } from './cohort.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CohortController();

    router.post('/', auth(), controller.create);
    router.put('/:id', auth(), controller.update);
    router.delete('/:id', auth(), controller.delete);
    router.get('/search', auth(), controller.search);

    router.get('/:id/stats', auth(), controller.getCohortStats);
    router.get('/:id/users', auth(), controller.getCohortUsers);
    router.post('/:id/users/:userId/add', auth(), controller.addUserToCohort);
    router.post('/:id/users/:userId/remove', auth(), controller.removeUserFromCohort);
    router.get('/:id', auth(), controller.getById);
    router.get('/tenants/:tenantId', auth(), controller.getCohortsForTenant);

    app.use('/api/v1/cohorts', router);
};

import express from 'express';
import { CohortController } from './cohort.controller';
import { auth } from '../../../auth/auth.handler';
import { CohortAuth } from './cohort.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CohortController();

    router.post('/', auth(CohortAuth.create), controller.create);
    router.put('/:id', auth(CohortAuth.update), controller.update);
    router.delete('/:id', auth(CohortAuth.delete), controller.delete);
    router.get('/search', auth(CohortAuth.search), controller.search);

    router.get('/:id/stats', auth(CohortAuth.getCohortStats), controller.getCohortStats);
    router.get('/:id/users', auth(CohortAuth.getCohortUsers), controller.getCohortUsers);
    router.post('/:id/users/:userId/add', auth(CohortAuth.addUserToCohort), controller.addUserToCohort);
    router.post('/:id/users/:userId/remove', auth(CohortAuth.removeUserFromCohort), controller.removeUserFromCohort);
    router.get('/:id', auth(CohortAuth.getById), controller.getById);
    router.get('/tenants/:tenantId', auth(CohortAuth.getCohortsForTenant), controller.getCohortsForTenant);

    app.use('/api/v1/cohorts', router);
};

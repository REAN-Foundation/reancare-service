import express from 'express';
import { CohortController } from './cohort.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CohortController();

    router.post('/', auth('Cohort.Create'), controller.create);
    router.put('/:id', auth('Cohort.Update'), controller.update);
    router.delete('/:id', auth('Cohort.Delete'), controller.delete);
    router.get('/search', auth('Cohort.Search'), controller.search);

    router.get('/:id/stats', auth('Cohort.GetCohortStats'), controller.getCohortStats);
    router.get('/:id/users', auth('Cohort.GetCohortUsers'), controller.getCohortUsers);
    router.post('/:id/users/:userId/add', auth('Cohort.AddUserToCohort'), controller.addUserToCohort);
    router.post('/:id/users/:userId/remove', auth('Cohort.RemoveUserFromCohort'), controller.removeUserFromCohort);
    router.get('/:id', auth('Cohort.GetById'), controller.getById);
    router.get('/tenants/:tenantId', auth('Cohort.GetCohortsForTenant'), controller.getCohortsForTenant);

    app.use('/api/v1/cohorts', router);
};

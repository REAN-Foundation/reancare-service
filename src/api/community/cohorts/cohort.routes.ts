import express from 'express';
import { CohortController } from './cohort.controller';
import { auth } from '../../../auth/auth.handler';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new CohortController();

    router.post('/', auth('Community.Cohort.Create'), controller.create);
    router.put('/:id', auth('Community.Cohort.Update'), controller.update);
    router.delete('/:id', auth('Community.Cohort.Delete'), controller.delete);
    router.get('/search', auth('Community.Cohort.Search'), controller.search);

    router.get('/:id/stats', auth('Community.Cohort.GetCohortStats'), controller.getCohortStats);
    router.get('/:id/users', auth('Community.Cohort.GetCohortUsers'), controller.getCohortUsers);
    router.post('/:id/users/:userId/add', auth('Community.Cohort.AddUserToCohort'), controller.addUserToCohort);
    router.post('/:id/users/:userId/remove', auth('Community.Cohort.RemoveUserFromCohort'), controller.removeUserFromCohort);
    router.get('/:id', auth('Community.Cohort.GetById'), controller.getById);
    router.get('/tenants/:tenantId', auth('Community.Cohort.GetCohortsForTenant'), controller.getCohortsForTenant);

    app.use('/api/v1/cohorts', router);
};

import express from 'express';
import { Loader } from '../../../startup/loader';
import { TypesController } from './types.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new TypesController();

    router.get('/person-roles', authenticator.authenticateClient, controller.getPersonRoleTypes);
    router.get('/organization-types', authenticator.authenticateClient, controller.getOrganizationTypes);
    router.get('/genders', authenticator.authenticateClient, controller.getGenderTypes);
    router.get('/blood-groups', authenticator.authenticateClient, controller.getBloodGroups);
    router.get('/race-types', authenticator.authenticateClient, controller.getRaceTypes);
    router.get('/ethnicity-types', authenticator.authenticateClient, controller.getEthnicityTypes);
    router.get('/marital-statuses', authenticator.authenticateClient, controller.getMaritalStatuses);
    router.get('/severities', authenticator.authenticateClient, controller.getSeverities);
    router.get('/priorities', authenticator.authenticateClient, controller.getPriorityTypes);
    router.get('/lab-records', authenticator.authenticateClient, controller.getLabRecordTypes);
    router.get('/group-activity-types', authenticator.authenticateClient, controller.getGroupActivityTypes);
    router.get('/reminder-types', authenticator.authenticateClient, controller.getReminderTypes);
    router.get('/reminder-repeat-after-every-units', authenticator.authenticateClient, controller.getReminderRepeatAfterEveryTypes);
    router.get('/goal-types', authenticator.authenticateClient, controller.getGoalTypes);
    router.get('/query-response-types', authenticator.authenticateClient, controller.getQueryResponseTypes);
    router.get('/user-engagement-categories', authenticator.authenticateClient, controller.getUserEngagementCategories);

    //Priority type
    router.post('/priorities/', authenticator.authenticateClient, authenticator.authenticateUser, controller.createPriorityType);
    router.get('/priorities/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getPriorityTypeById);
    router.put('/priorities/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.updatePriorityType);
    router.delete('/priorities/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.deletePriorityType);

    //Person role
    router.post('/person-roles/', authenticator.authenticateClient, authenticator.authenticateUser, controller.createRoleType);
    router.get('/person-roles/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getRoleTypeById);
    router.put('/person-roles/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateRoleType);
    router.delete('/person-roles/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.deleteRoleType);

    //Lab record
    router.post('/lab-records/', authenticator.authenticateClient, authenticator.authenticateUser, controller.createLabRecordType);
    router.get('/lab-records/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getLabRecordTypeById);
    router.put('/lab-records/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateLabRecordType);
    router.delete('/lab-records/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.deleteLabRecordType);

    //Goal type
    router.post('/goal-types/', authenticator.authenticateClient, authenticator.authenticateUser, controller.createGoalType);
    router.get('/goal-types/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.getGoalTypeById);
    router.put('/goal-types/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.updateGoalType);
    router.delete('/goal-types/:id', authenticator.authenticateClient, authenticator.authenticateUser, controller.deleteGoalType);

    app.use('/api/v1/types', router);
};


import express from 'express';
import { Loader } from '../../../startup/loader';
import { TypesController } from './types.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const authenticator = Loader.authenticator;
    const controller = new TypesController();

    router.get('/person-roles', controller.getPersonRoleTypes);
    router.get('/organization-types', controller.getOrganizationTypes);
    router.get('/genders', controller.getGenderTypes);
    router.get('/blood-groups', controller.getBloodGroups);
    router.get('/race-types', controller.getRaceTypes);
    router.get('/ethnicity-types', controller.getEthnicityTypes);
    router.get('/marital-statuses', controller.getMaritalStatuses);
    router.get('/severities', controller.getSeverities);
    router.get('/priorities', controller.getPriorityTypes);
    router.get('/lab-records', controller.getLabRecordTypes);
    router.get('/group-activity-types', controller.getGroupActivityTypes);
    router.get('/reminder-types', controller.getReminderTypes);
    router.get('/reminder-repeat-after-every-units', controller.getReminderRepeatAfterEveryTypes);
    router.get('/goal-types', controller.getGoalTypes);
    router.get('/query-response-types', controller.getQueryResponseTypes);
    router.get('/user-engagement-categories', controller.getUserEngagementCategories);

    //Priority type
    router.post('/priorities/', authenticator.authenticateUser, controller.createPriorityType);
    router.get('/priorities/:id', authenticator.authenticateUser, controller.getPriorityTypeById);
    router.put('/priorities/:id', authenticator.authenticateUser, controller.updatePriorityType);
    router.delete('/priorities/:id', authenticator.authenticateUser, controller.deletePriorityType);

    //Person role
    router.post('/person-roles/', authenticator.authenticateUser, controller.createRoleType);
    router.get('/person-roles/:id', authenticator.authenticateUser, controller.getRoleTypeById);
    router.put('/person-roles/:id', authenticator.authenticateUser, controller.updateRoleType);
    router.delete('/person-roles/:id', authenticator.authenticateUser, controller.deleteRoleType);

    //Lab record
    router.post('/lab-records/', authenticator.authenticateUser, controller.createLabRecordType);
    router.get('/lab-records/:id', authenticator.authenticateUser, controller.getLabRecordTypeById);
    router.put('/lab-records/:id', authenticator.authenticateUser, controller.updateLabRecordType);
    router.delete('/lab-records/:id', authenticator.authenticateUser, controller.deleteLabRecordType);

    //Goal type
    router.post('/goal-types/', authenticator.authenticateUser, controller.createGoalType);
    router.get('/goal-types/:id', authenticator.authenticateUser, controller.getGoalTypeById);
    router.put('/goal-types/:id', authenticator.authenticateUser, controller.updateGoalType);
    router.delete('/goal-types/:id', authenticator.authenticateUser, controller.deleteGoalType);

    app.use('/api/v1/types', router);
};


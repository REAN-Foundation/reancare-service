import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { TypesController } from './types.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
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
    router.post('/priorities/', auth(), controller.createPriorityType);
    router.get('/priorities/:id', auth(), controller.getPriorityTypeById);
    router.put('/priorities/:id', auth(), controller.updatePriorityType);
    router.delete('/priorities/:id', auth(), controller.deletePriorityType);

    //Person role
    router.post('/person-roles/', auth(), controller.createRoleType);
    router.get('/person-roles/:id', auth(), controller.getRoleTypeById);
    router.put('/person-roles/:id', auth(), controller.updateRoleType);
    router.delete('/person-roles/:id', auth(), controller.deleteRoleType);

    //Lab record
    router.post('/lab-records/', auth(), controller.createLabRecordType);
    router.get('/lab-records/:id', auth(), controller.getLabRecordTypeById);
    router.put('/lab-records/:id', auth(), controller.updateLabRecordType);
    router.delete('/lab-records/:id', auth(), controller.deleteLabRecordType);

    //Goal type
    router.post('/goal-types/', auth(), controller.createGoalType);
    router.get('/goal-types/:id', auth(), controller.getGoalTypeById);
    router.put('/goal-types/:id', auth(), controller.updateGoalType);
    router.delete('/goal-types/:id', auth(), controller.deleteGoalType);

    app.use('/api/v1/types', router);
};


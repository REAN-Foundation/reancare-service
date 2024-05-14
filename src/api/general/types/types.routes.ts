import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { TypesController } from './types.controller';
import { TypesAuth } from './types.auth';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new TypesController();

    router.get('/person-roles', auth(TypesAuth.getPersonRoleTypes), controller.getPersonRoleTypes);
    router.get('/organization-types', auth(TypesAuth.getOrganizationTypes), controller.getOrganizationTypes);
    router.get('/genders', auth(TypesAuth.getGenderTypes), controller.getGenderTypes);
    router.get('/blood-groups', auth(TypesAuth.getBloodGroups), controller.getBloodGroups);
    router.get('/race-types', auth(TypesAuth.getRaceTypes), controller.getRaceTypes);
    router.get('/ethnicity-types', auth(TypesAuth.getEthnicityTypes), controller.getEthnicityTypes);
    router.get('/marital-statuses', auth(TypesAuth.getMaritalStatuses), controller.getMaritalStatuses);
    router.get('/severities', auth(TypesAuth.getSeverities), controller.getSeverities);
    router.get('/priorities', auth(TypesAuth.getPriorityTypes), controller.getPriorityTypes);
    router.get('/lab-records', auth(TypesAuth.getLabRecordTypes), controller.getLabRecordTypes);
    router.get('/group-activity-types', auth(TypesAuth.getGroupActivityTypes), controller.getGroupActivityTypes);
    router.get('/reminder-types', auth(TypesAuth.getReminderTypes), controller.getReminderTypes);
    router.get('/reminder-repeat-after-every-units', auth(TypesAuth.getReminderRepeatAfterEveryTypes), controller.getReminderRepeatAfterEveryTypes);
    router.get('/goal-types', auth(TypesAuth.getGoalTypes), controller.getGoalTypes);
    router.get('/query-response-types', auth(TypesAuth.getQueryResponseTypes), controller.getQueryResponseTypes);
    router.get('/user-engagement-categories', auth(TypesAuth.getUserEngagementCategories), controller.getUserEngagementCategories);

    //Priority type
    router.post('/priorities/', auth(TypesAuth.createPriorityType), controller.createPriorityType);
    router.get('/priorities/:id', auth(TypesAuth.getPriorityTypeById), controller.getPriorityTypeById);
    router.put('/priorities/:id', auth(TypesAuth.updatePriorityType), controller.updatePriorityType);
    router.delete('/priorities/:id', auth(TypesAuth.deletePriorityType), controller.deletePriorityType);

    //Person role
    router.post('/person-roles/', auth(TypesAuth.createRoleType), controller.createRoleType);
    router.get('/person-roles/:id', auth(TypesAuth.getRoleTypeById), controller.getRoleTypeById);
    router.put('/person-roles/:id', auth(TypesAuth.updateRoleType), controller.updateRoleType);
    router.delete('/person-roles/:id', auth(TypesAuth.deleteRoleType), controller.deleteRoleType);

    //Lab record
    router.post('/lab-records/', auth(TypesAuth.createLabRecordType), controller.createLabRecordType);
    router.get('/lab-records/:id', auth(TypesAuth.getLabRecordTypeById), controller.getLabRecordTypeById);
    router.put('/lab-records/:id', auth(TypesAuth.updateLabRecordType), controller.updateLabRecordType);
    router.delete('/lab-records/:id', auth(TypesAuth.deleteLabRecordType), controller.deleteLabRecordType);

    //Goal type
    router.post('/goal-types/', auth(TypesAuth.createGoalType), controller.createGoalType);
    router.get('/goal-types/:id', auth(TypesAuth.getGoalTypeById), controller.getGoalTypeById);
    router.put('/goal-types/:id', auth(TypesAuth.updateGoalType), controller.updateGoalType);
    router.delete('/goal-types/:id', auth(TypesAuth.deleteGoalType), controller.deleteGoalType);

    app.use('/api/v1/types', router);
};

import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { TypesController } from './types.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new TypesController();

    router.get('/person-roles', auth('Types.GetPersonRoleTypes', true), controller.getPersonRoleTypes);
    router.get('/organization-types', auth('Types.GetOrganizationTypes', true), controller.getOrganizationTypes);
    router.get('/genders', auth('Types.GetGenderTypes', true), controller.getGenderTypes);
    router.get('/blood-groups', auth('Types.GetBloodGroups', true), controller.getBloodGroups);
    router.get('/race-types', auth('Types.GetRaceTypes', true), controller.getRaceTypes);
    router.get('/ethnicity-types', auth('Types.GetEthnicityTypes', true), controller.getEthnicityTypes);
    router.get('/marital-statuses', auth('Types.GetMaritalStatuses', true), controller.getMaritalStatuses);
    router.get('/severities', auth('Types.GetSeverities', true), controller.getSeverities);
    router.get('/priorities', auth('Types.HealthPriority.GetPriorityTypes', true), controller.getPriorityTypes);
    router.get('/lab-records', auth('Types.LabRecords', true), controller.getLabRecordTypes);
    router.get('/group-activity-types', auth('Types.GroupActivityTypes', true), controller.getGroupActivityTypes);
    router.get('/reminder-types', auth('Types.ReminderTypes', true), controller.getReminderTypes);
    router.get('/reminder-repeat-after-every-units', auth('Types.ReminderRepeatAfterEveryNUnits', true), controller.getReminderRepeatAfterEveryTypes);
    router.get('/goal-types', auth('Types.GoalType.GetGoalTypes', true), controller.getGoalTypes);
    router.get('/query-response-types', auth('Types.GetQueryResponseTypes', true), controller.getQueryResponseTypes);
    router.get('/user-engagement-categories', auth('Types.GetUserEngagementCategories', true), controller.getUserEngagementCategories);

    //Priority type
    router.post('/priorities/', auth('Types.HealthPriorityType.Create'), controller.createPriorityType);
    router.get('/priorities/:id', auth('Types.HealthPriorityType.GetById'), controller.getPriorityTypeById);
    router.put('/priorities/:id', auth('Types.HealthPriorityType.Update'), controller.updatePriorityType);
    router.delete('/priorities/:id', auth('Types.HealthPriorityType.Delete'), controller.deletePriorityType);

    //Person role
    router.post('/person-roles/', auth('Types.RoleType.Create'), controller.createRoleType);
    router.get('/person-roles/:id', auth('Types.RoleType.GetById'), controller.getRoleTypeById);
    router.put('/person-roles/:id', auth('Types.RoleType.Update'), controller.updateRoleType);
    router.delete('/person-roles/:id', auth('Types.RoleType.Delete'), controller.deleteRoleType);

    //Lab record
    router.post('/lab-records/', auth('Types.LabRecordType.Create'), controller.createLabRecordType);
    router.get('/lab-records/:id', auth('Types.LabRecordType.GetById'), controller.getLabRecordTypeById);
    router.put('/lab-records/:id', auth('Types.LabRecordType.Update'), controller.updateLabRecordType);
    router.delete('/lab-records/:id', auth('Types.LabRecordType.Delete'), controller.deleteLabRecordType);

    //Goal type
    router.post('/goal-types/', auth('Types.GoalType.Create'), controller.createGoalType);
    router.get('/goal-types/:id', auth('Types.GoalType.GetById'), controller.getGoalTypeById);
    router.put('/goal-types/:id', auth('Types.GoalType.Update'), controller.updateGoalType);
    router.delete('/goal-types/:id', auth('Types.GoalType.Delete'), controller.deleteGoalType);

    app.use('/api/v1/types', router);
};


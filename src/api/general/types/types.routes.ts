import express from 'express';
import { auth } from '../../../auth/auth.handler';
import { TypesController } from './types.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new TypesController();

    router.get('/person-roles', auth('General.Types.GetPersonRoleTypes', true), controller.getPersonRoleTypes);
    router.get('/organization-types', auth('General.Types.GetOrganizationTypes', true), controller.getOrganizationTypes);
    router.get('/genders', auth('General.Types.GetGenderTypes', true), controller.getGenderTypes);
    router.get('/blood-groups', auth('General.Types.GetBloodGroups', true), controller.getBloodGroups);
    router.get('/race-types', auth('General.Types.GetRaceTypes', true), controller.getRaceTypes);
    router.get('/ethnicity-types', auth('General.Types.GetEthnicityTypes', true), controller.getEthnicityTypes);
    router.get('/marital-statuses', auth('General.Types.GetMaritalStatuses', true), controller.getMaritalStatuses);
    router.get('/severities', auth('General.Types.GetSeverities', true), controller.getSeverities);
    router.get('/priorities', auth('General.Types.HealthPriority.GetPriorityTypes', true), controller.getPriorityTypes);
    router.get('/lab-records', auth('General.Types.LabRecords', true), controller.getLabRecordTypes);
    router.get('/group-activity-types', auth('General.Types.GroupActivityTypes', true), controller.getGroupActivityTypes);
    router.get('/reminder-types', auth('General.Types.ReminderTypes', true), controller.getReminderTypes);
    router.get('/reminder-repeat-after-every-units', auth('General.Types.ReminderRepeatAfterEveryNUnits', true), controller.getReminderRepeatAfterEveryTypes);
    router.get('/goal-types', auth('General.Types.GoalType.GetGoalTypes', true), controller.getGoalTypes);
    router.get('/query-response-types', auth('General.Types.GetQueryResponseTypes', true), controller.getQueryResponseTypes);
    router.get('/user-engagement-categories', auth('General.Types.GetUserEngagementCategories', true), controller.getUserEngagementCategories);

    //Priority type
    router.post('/priorities/', auth('General.Types.HealthPriorityType.Create'), controller.createPriorityType);
    router.get('/priorities/:id', auth('General.Types.HealthPriorityType.GetById'), controller.getPriorityTypeById);
    router.put('/priorities/:id', auth('General.Types.HealthPriorityType.Update'), controller.updatePriorityType);
    router.delete('/priorities/:id', auth('General.Types.HealthPriorityType.Delete'), controller.deletePriorityType);

    //Person role
    router.post('/person-roles/', auth('General.Types.RoleType.Create'), controller.createRoleType);
    router.get('/person-roles/:id', auth('General.Types.RoleType.GetById'), controller.getRoleTypeById);
    router.put('/person-roles/:id', auth('General.Types.RoleType.Update'), controller.updateRoleType);
    router.delete('/person-roles/:id', auth('General.Types.RoleType.Delete'), controller.deleteRoleType);

    //Lab record
    router.post('/lab-records/', auth('General.Types.LabRecordType.Create'), controller.createLabRecordType);
    router.get('/lab-records/:id', auth('General.Types.LabRecordType.GetById'), controller.getLabRecordTypeById);
    router.put('/lab-records/:id', auth('General.Types.LabRecordType.Update'), controller.updateLabRecordType);
    router.delete('/lab-records/:id', auth('General.Types.LabRecordType.Delete'), controller.deleteLabRecordType);

    //Goal type
    router.post('/goal-types/', auth('General.Types.GoalType.Create'), controller.createGoalType);
    router.get('/goal-types/:id', auth('General.Types.GoalType.GetById'), controller.getGoalTypeById);
    router.put('/goal-types/:id', auth('General.Types.GoalType.Update'), controller.updateGoalType);
    router.delete('/goal-types/:id', auth('General.Types.GoalType.Delete'), controller.deleteGoalType);

    app.use('/api/v1/types', router);
};


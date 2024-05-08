import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class TypesAuth {

    static readonly _baseContext = 'General.Types';

    static readonly createPriorityType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.HealthPriorityType.Create`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.CreateOne,
    };

    static readonly getPriorityTypeById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.HealthPriorityType.GetById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    static readonly updatePriorityType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.HealthPriorityType.Update`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.UpdateOne,
    };

    static readonly deletePriorityType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.HealthPriorityType.Delete`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.DeleteOne,
    };

    static readonly createRoleType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.RoleType.Create`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.CreateOne,
    };

    static readonly getRoleTypeById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.RoleType.GetById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    static readonly updateRoleType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.RoleType.Update`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.UpdateOne,
    };

    static readonly deleteRoleType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.RoleType.Delete`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.DeleteOne,
    };

    static readonly createLabRecordType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.LabRecordType.Create`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.CreateOne,
    };

    static readonly getLabRecordTypeById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.LabRecordType.GetById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    static readonly updateLabRecordType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.LabRecordType.Update`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.UpdateOne,
    };

    static readonly deleteLabRecordType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.LabRecordType.Delete`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.DeleteOne,
    };

    static readonly createGoalType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GoalType.Create`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.CreateOne,
    };

    static readonly getGoalTypeById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GoalType.GetById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    static readonly updateGoalType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GoalType.Update`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.UpdateOne,
    };

    static readonly deleteGoalType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GoalType.Delete`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.DeleteOne,
    };

    static readonly getPersonRoleTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GetPersonRoleTypes`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

    static readonly getOrganizationTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GetOrganizationTypes`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

    static readonly getGenderTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GetGenderTypes`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

    static readonly getBloodGroups: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GetBloodGroups`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

    static readonly getRaceTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GetRaceTypes`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

    static readonly getEthnicityTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GetEthnicityTypes`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

    static readonly getMaritalStatuses: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GetMaritalStatuses`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

    static readonly getSeverities: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GetSeverities`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

    static readonly getPriorityTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.HealthPriority.GetPriorityTypes`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

    static readonly getLabRecordTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.LabRecords`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

    static readonly getGroupActivityTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GroupActivityTypes`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

    static readonly getReminderTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.ReminderTypes`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

    static readonly getReminderRepeatAfterEveryTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.ReminderRepeatAfterEveryNUnits`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

    static readonly getGoalTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GoalType.GetGoalTypes`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

    static readonly getQueryResponseTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GetQueryResponseTypes`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

    static readonly getUserEngagementCategories: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GetUserEngagementCategories`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
        OptionalUserAuth : true
    };

}

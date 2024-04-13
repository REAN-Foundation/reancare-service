import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class TypesAuth {

    static _baseContext = 'General.Types';

    static createPriorityType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.HealthPriorityType.Create`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.CreateOne,
    };

    static getPriorityTypeById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.HealthPriorityType.GetById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    static updatePriorityType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.HealthPriorityType.Update`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.UpdateOne,
    };

    static deletePriorityType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.HealthPriorityType.Delete`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.DeleteOne,
    };

    static createRoleType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.RoleType.Create`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.CreateOne,
    };

    static getRoleTypeById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.RoleType.GetById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    static updateRoleType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.RoleType.Update`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.UpdateOne,
    };

    static deleteRoleType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.RoleType.Delete`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.DeleteOne,
    };

    static createLabRecordType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.LabRecordType.Create`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.CreateOne,
    };

    static getLabRecordTypeById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.LabRecordType.GetById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    static updateLabRecordType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.LabRecordType.Update`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.UpdateOne,
    };

    static deleteLabRecordType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.LabRecordType.Delete`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.DeleteOne,
    };

    static createGoalType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GoalType.Create`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.CreateOne,
    };

    static getGoalTypeById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GoalType.GetById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    static updateGoalType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GoalType.Update`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.UpdateOne,
    };

    static deleteGoalType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GoalType.Delete`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.DeleteOne,
    };

    static getPersonRoleTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPersonRoleTypes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getOrganizationTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetOrganizationTypes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getGenderTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetGenderTypes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getBloodGroups: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetBloodGroups`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getRaceTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetRaceTypes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getEthnicityTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetEthnicityTypes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getMaritalStatuses: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetMaritalStatuses`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getSeverities: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetSeverities`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getPriorityTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.HealthPriority.GetPriorityTypes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getLabRecordTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.LabRecords`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getGroupActivityTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GroupActivityTypes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getReminderTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.ReminderTypes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getReminderRepeatAfterEveryTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.ReminderRepeatAfterEveryNUnits`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getGoalTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GoalType.GetGoalTypes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getQueryResponseTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetQueryResponseTypes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getUserEngagementCategories: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserEngagementCategories`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

}
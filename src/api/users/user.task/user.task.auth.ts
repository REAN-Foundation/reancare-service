import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserTaskAuth {

    static _baseContext = 'User.Task';

    static getCategories: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GetCategories`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
    };

    static getUserActionTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GetUserActionTypes`,
        Ownership        : ResourceOwnership.System,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.GetMany,
    };

    static create: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.Create`,
        Ownership        : ResourceOwnership.Owner,
        ActionScope      : ActionScope.Tenant,
        RequestType      : RequestType.CreateOne,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.Search`,
        Ownership        : ResourceOwnership.Owner,
        ActionScope      : ActionScope.Tenant,
        RequestType      : RequestType.Search,
    };

    static startTask: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.StartTask`,
        Ownership        : ResourceOwnership.Owner,
        ActionScope      : ActionScope.Owner,
        RequestType      : RequestType.UpdateOne,
    };

    static finishTask: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.FinishTask`,
        Ownership        : ResourceOwnership.Owner,
        ActionScope      : ActionScope.Owner,
        RequestType      : RequestType.UpdateOne,
    };

    static cancelTask: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.CancelTask`,
        Ownership        : ResourceOwnership.Owner,
        ActionScope      : ActionScope.Owner,
        RequestType      : RequestType.UpdateOne,
    };

    static getTaskSummaryForDay: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.SummaryForDay`,
        Ownership        : ResourceOwnership.Owner,
        ActionScope      : ActionScope.Tenant,
        RequestType      : RequestType.GetOne,
    };

    static getByDisplayId: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GetByDisplayId`,
        Ownership        : ResourceOwnership.Owner,
        ActionScope      : ActionScope.Tenant,
        RequestType      : RequestType.GetOne,
    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.GetById`,
        Ownership        : ResourceOwnership.Owner,
        ActionScope      : ActionScope.Tenant,
        RequestType      : RequestType.GetOne,
    };

    static update: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.Update`,
        Ownership        : ResourceOwnership.Owner,
        ActionScope      : ActionScope.Owner,
        RequestType      : RequestType.UpdateOne,
    };

    static delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.Delete`,
        Ownership        : ResourceOwnership.Owner,
        ActionScope      : ActionScope.Owner,
        RequestType      : RequestType.DeleteOne,
    };

    static deletePatientFutureTask: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.DeleteFutureTask`,
        Ownership        : ResourceOwnership.Owner,
        ActionScope      : ActionScope.Owner,
        RequestType      : RequestType.DeleteOne,
        ResourceIdName   : 'userId'
    };

}
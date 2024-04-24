import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserTaskAuth {

    static readonly _baseContext = 'User.UserTask';

    static readonly getCategories: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetCategories`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static readonly getUserActionTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserActionTypes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.Search,
    };

    static readonly startTask: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.StartTask`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

    static readonly finishTask: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.FinishTask`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

    static readonly cancelTask: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CancelTask`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

    static readonly getTaskSummaryForDay: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.SummaryForDay`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getByDisplayId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetByDisplayId`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

    static readonly delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.DeleteOne,
    };

    static readonly deletePatientFutureTask: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.DeleteFutureTask`,
        Ownership      : ResourceOwnership.Owner,
        ActionScope    : ActionScope.Owner,
        RequestType    : RequestType.DeleteOne,
        ResourceIdName : 'userId'
    };

}

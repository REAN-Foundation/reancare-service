import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthPriorityAuth {

    static readonly _baseContext = 'User.Patient.HealthPriority';

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

    static readonly getPatientHealthPriorities: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPatientHealthPriorities`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetMany,
    };

    static readonly update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

}

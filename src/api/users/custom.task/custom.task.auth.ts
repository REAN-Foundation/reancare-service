import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class CustomTaskAuth {

    static readonly _baseContext = 'User.CustomTask';

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    // static readonly search: AuthOptions = {
    //     ...DefaultAuthOptions,
    //     Context     : `${this._baseContext}.Search`,
    //     Ownership   : ResourceOwnership.Owner,
    //     ActionScope : ActionScope.Tenant,
    //     RequestType : RequestType.GetMany,
    // };

    static readonly update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    // static readonly delete: AuthOptions = {
    //     ...DefaultAuthOptions,
    //     Context     : `${this._baseContext}.Delete`,
    //     Ownership   : ResourceOwnership.System,
    //     ActionScope : ActionScope.System,
    //     RequestType : RequestType.DeleteOne,
    // };

}

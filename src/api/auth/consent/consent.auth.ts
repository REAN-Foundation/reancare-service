import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ConsentAuth {

    static readonly _baseContext = `Auth.Consent`;

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        ActionScope : ActionScope.Owner,
        Ownership   : ResourceOwnership.Owner,
        RequestType : RequestType.CreateOne,
    };

    static readonly update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        ActionScope : ActionScope.Owner,
        Ownership   : ResourceOwnership.Owner,
        RequestType : RequestType.UpdateOne,
    };

    static readonly delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        ActionScope : ActionScope.Owner,
        Ownership   : ResourceOwnership.Owner,
        RequestType : RequestType.DeleteOne,
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        ActionScope : ActionScope.Tenant,
        Ownership   : ResourceOwnership.Owner,
        RequestType : RequestType.Search,
    };

    static readonly getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        ActionScope : ActionScope.Tenant,
        Ownership   : ResourceOwnership.Owner,
        RequestType : RequestType.GetOne,
    };

}

import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions } from '../../auth/auth.types';

export class ClientAppAuth {

    static readonly _baseContext = `ClientApp`;

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        RequestType : RequestType.CreateOne,
        ActionScope : ActionScope.System,
        Ownership   : ResourceOwnership.System,
    };

    static readonly update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        ActionScope : ActionScope.System,
        Ownership   : ResourceOwnership.System,
        RequestType : RequestType.UpdateOne,
    };

    static readonly delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        ActionScope : ActionScope.System,
        Ownership   : ResourceOwnership.System,
        RequestType : RequestType.DeleteOne,
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        ActionScope : ActionScope.System,
        Ownership   : ResourceOwnership.System,
        RequestType : RequestType.Search,
    };

    static readonly getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        ActionScope : ActionScope.System,
        Ownership   : ResourceOwnership.System,
        RequestType : RequestType.GetOne,
    };

    static readonly getCurrentApiKey: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.GetCurrentApiKey`,
        ActionScope         : ActionScope.System,
        Ownership           : ResourceOwnership.System,
        RequestType         : RequestType.Custom,
        ClientAppAuth       : false,
        CustomAuthorization : false,
        AlternateAuth       : true,
    };

    static readonly renewApiKey: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.RenewApiKey`,
        ActionScope         : ActionScope.System,
        Ownership           : ResourceOwnership.System,
        RequestType         : RequestType.Custom,
        ClientAppAuth       : false,
        CustomAuthorization : false,
        AlternateAuth       : true,
    };

}

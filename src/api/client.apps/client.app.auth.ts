import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions } from '../../auth/auth.types';

export class ClientAppAuth {

    static _baseContext = `ClientApp`;

    static create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        RequestType : RequestType.CreateOne,
        ActionScope : ActionScope.System,
        Ownership   : ResourceOwnership.System,
    };

    static update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        ActionScope : ActionScope.System,
        Ownership   : ResourceOwnership.System,
        RequestType : RequestType.UpdateOne,
    };

    static delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        ActionScope : ActionScope.System,
        Ownership   : ResourceOwnership.System,
        RequestType : RequestType.DeleteOne,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        ActionScope : ActionScope.System,
        Ownership   : ResourceOwnership.System,
        RequestType : RequestType.Search,
    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        ActionScope : ActionScope.System,
        Ownership   : ResourceOwnership.System,
        RequestType : RequestType.GetOne,
    };

    static getCurrentApiKey: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.GetCurrentApiKey`,
        ActionScope         : ActionScope.System,
        Ownership           : ResourceOwnership.System,
        RequestType         : RequestType.Custom,
        ClientAppAuth       : false,
        CustomAuthorization : false,
        AlternateAuth       : true,
    };

    static renewApiKey: AuthOptions = {
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

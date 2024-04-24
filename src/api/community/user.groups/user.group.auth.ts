import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserGroupAuth {

    static readonly _baseContext = `Community.UserGroup`;

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
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

    static readonly getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

    static readonly getGroupActivityTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetGroupActivityTypes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

    static readonly makeUserAdmin: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.MakeUserAdmin`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly removeUserAdmin: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.RemoveUserAdmin`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly getGroupAdmins: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetGroupAdmins`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly setGroupActivityTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.SetGroupActivityTypes`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly getGroupUsers: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetGroupUsers`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly addUserToGroup: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.AddUserToGroup`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly removeUserFromGroup: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.RemoveUserFromGroup`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.Search`,
        Ownership           : ResourceOwnership.System,
        ActionScope         : ActionScope.Public,
        RequestType         : RequestType.Search,
        CustomAuthorization : true,
    };

}

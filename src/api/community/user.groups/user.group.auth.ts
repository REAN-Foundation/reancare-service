import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserGroupAuth {

static _baseContext = `Community.UserGroup`;

static create: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Create`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.CreateOne,
};

static update: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Update`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.UpdateOne,
};

static delete: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Delete`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.DeleteOne,
};

static getById: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetById`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Public,
    RequestType : RequestType.GetOne,
};

static getGroupActivityTypes: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetGroupActivityTypes`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Public,
    RequestType : RequestType.GetOne,
};

static makeUserAdmin: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.MakeUserAdmin`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.CreateOne,
};

static removeUserAdmin: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.RemoveUserAdmin`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.CreateOne,
};

static getGroupAdmins: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetGroupAdmins`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.GetOne,
};

static setGroupActivityTypes: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.SetGroupActivityTypes`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.CreateOne,
};

static getGroupUsers: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetGroupUsers`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.GetOne,
};

static addUserToGroup: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.AddUserToGroup`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.CreateOne,
};

static removeUserFromGroup: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.RemoveUserFromGroup`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.CreateOne,
};

static search: AuthOptions = {
    ...DefaultAuthOptions,
    Context             : `${this._baseContext}.Search`,
    Ownership           : ResourceOwnership.Tenant,
    ActionScope         : ActionScope.Public,
    RequestType         : RequestType.Search,
    CustomAuthorization : true,
};

}

import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class NoticeAuth {

static readonly _baseContext = `Community.Notice`;

static readonly create: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Create`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.CreateOne,
};

static readonly update: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Update`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.UpdateOne,
};

static readonly delete: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Delete`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.DeleteOne,
};

static readonly getById: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetById`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Public,
    RequestType : RequestType.GetOne,
};

static readonly takeAction: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.TakeAction`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.CreateOne,
};

static readonly getAllNoticeActionsForUser: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetAllNoticeActionsForUser`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static readonly getNoticeActionForUser: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetNoticeActionForUser`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static readonly search: AuthOptions = {
    ...DefaultAuthOptions,
    Context             : `${this._baseContext}.Search`,
    Ownership           : ResourceOwnership.Tenant,
    ActionScope         : ActionScope.Tenant,
    RequestType         : RequestType.Search,
    CustomAuthorization : true,
};

}

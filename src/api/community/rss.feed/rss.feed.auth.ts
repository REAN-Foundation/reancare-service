import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class RssFeedAuth {

static _baseContext = `Community.RssFeed`;

static create: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Create`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.CreateOne,
};

static update: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Update`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.UpdateOne,
};

static delete: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Delete`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.DeleteOne,
};

static getById: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetById`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Public,
    RequestType : RequestType.GetOne,
};

static getRssFeed: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetRssFeed`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Public,
    RequestType : RequestType.GetOne,
};

static getAtomFeed: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetAtomFeed`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Public,
    RequestType : RequestType.GetOne,
};

static getJsonFeed: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetJsonFeed`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Public,
    RequestType : RequestType.GetOne,
};

static search: AuthOptions = {
    ...DefaultAuthOptions,
    Context             : `${this._baseContext}.Search`,
    Ownership           : ResourceOwnership.Tenant,
    ActionScope         : ActionScope.Public,
    RequestType         : RequestType.Search,
    CustomAuthorization : true,
};

static addFeedItem: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.AddFeedItem`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.CreateOne,
};

static updateFeedItem: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.UpdateFeedItem`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.UpdateOne,
};

static deleteFeedItem: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.DeleteFeedItem`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.DeleteOne,
};

static getFeedItemById: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetFeedItemById`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Public,
    RequestType : RequestType.GetOne,
};

}

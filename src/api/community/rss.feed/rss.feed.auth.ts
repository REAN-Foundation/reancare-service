import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class RssFeedAuth {

    static readonly _baseContext = `Community.Rssfeed`;

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
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

    static readonly getRssFeed: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetRssFeed`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

    static readonly getAtomFeed: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetAtomFeed`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

    static readonly getJsonFeed: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetJsonFeed`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.Search`,
        Ownership           : ResourceOwnership.System,
        ActionScope         : ActionScope.Public,
        RequestType         : RequestType.Search,
        CustomAuthorization : true,
    };

    static readonly addFeedItem: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.AddFeedItem`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly updateFeedItem: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateFeedItem`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly deleteFeedItem: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteFeedItem`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

    static readonly getFeedItemById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetFeedItemById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

}

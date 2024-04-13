import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

// Please note that - the ownership of the notification is with dual.
// - The notification can  owned by  a particular user or targeted towards a particular user.
// - The notification can be owned by a tenant or targeted towards all/some the users in the tenant.

export class NotificationAuth {

    static _baseContext = 'General.Notification';

    static create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.System,
        RequestType : RequestType.CreateOne,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.System,
        RequestType : RequestType.Search,
    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
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

    static markAsRead: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.MarkAsRead`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

    static send: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Send`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.System,
        RequestType : RequestType.UpdateOne,
    };

    static sendToUser: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.SendToUser`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.System,
        RequestType : RequestType.UpdateOne,
    };

}

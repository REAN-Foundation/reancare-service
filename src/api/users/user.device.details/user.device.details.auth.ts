import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserDeviceDetailsAuth {

    static _baseContext = 'User.DeviceDetails';

    static create: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.Create`,
        Ownership        : ResourceOwnership.Owner,
        ActionScope      : ActionScope.Public,
        RequestType      : RequestType.CreateOne,
    };

    static sendTestNotification: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.SendTestNotification`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.UpdateOne,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.Search,
    };

    static getByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetByUserId`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
        ResourceIdName: 'userId'
    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
        ResourceIdName: 'id'
    };

    static update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

    static delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.DeleteOne,
    };
}
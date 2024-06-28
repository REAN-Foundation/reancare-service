import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserDeviceDetailsAuth {

    static readonly _baseContext = 'User.DeviceDetails';

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.CreateOne,
    };

    static readonly sendTestNotification: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.SendTestNotification`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.UpdateOne,
    };

    static readonly sendNotificationWithTopic: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.SendNotificationWithTopic`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.UpdateOne,
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.Search,
    };

    static readonly getByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.GetByUserId`,
        Ownership      : ResourceOwnership.Owner,
        ActionScope    : ActionScope.Tenant,
        RequestType    : RequestType.GetOne,
        ResourceIdName : 'userId'
    };

    static readonly getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.GetById`,
        Ownership      : ResourceOwnership.Owner,
        ActionScope    : ActionScope.Tenant,
        RequestType    : RequestType.GetOne,
        ResourceIdName : 'id'
    };

    static readonly update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

    static readonly delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.DeleteOne,
    };

}

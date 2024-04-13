import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsAuth {

    static _baseContext = 'Tenant.Settings';

    static getTenantSettingsTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetTenantSettingsTypes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getTenantSettingsByType: AuthOptions = {
        ...DefaultAuthOptions,
        Context       : `${this._baseContext}.GetTenantSettingsByType`,
        Ownership     : ResourceOwnership.Tenant,
        ActionScope   : ActionScope.Tenant,
        RequestType   : RequestType.GetOne,
        ResourceIdName: 'tenantId',
    };

    static getTenantSettings: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetTenantSettings`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
        ResourceIdName: 'tenantId',
    };

    static updateTenantSettingsByType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateTenantSettingsByType`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static updateTenantSettings: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateTenantSettings`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

}
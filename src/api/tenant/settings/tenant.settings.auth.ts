import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsAuth {

    static readonly _baseContext = 'Tenant.Settings';

    static readonly getTenantSettingsTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetTenantSettingsTypes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static readonly getTenantSettingsByType: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.GetTenantSettingsByType`,
        Ownership      : ResourceOwnership.Tenant,
        ActionScope    : ActionScope.Tenant,
        RequestType    : RequestType.GetOne,
        ResourceIdName : 'tenantId',
    };

    static readonly getTenantSettings: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.GetTenantSettings`,
        Ownership      : ResourceOwnership.Tenant,
        ActionScope    : ActionScope.Tenant,
        RequestType    : RequestType.GetOne,
        ResourceIdName : 'tenantId',
    };

    static readonly updateTenantSettingsByType: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateTenantSettingsByType`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly updateTenantSettings: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateTenantSettings`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly getTenantSettingsByCode: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetTenantSettingsByCode`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

}

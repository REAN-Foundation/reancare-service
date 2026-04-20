import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantSettingsMarketingAuth {

    static readonly _baseContext = 'Tenant.SettingsMarketing';

    static readonly getByTenant: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.GetByTenant`,
        Ownership      : ResourceOwnership.Tenant,
        ActionScope    : ActionScope.Tenant,
        RequestType    : RequestType.GetOne,
        ResourceIdName : 'tenantId',
    };

    static readonly updateAll: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateAll`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

    static readonly updateImages: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateImages`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly updateQRCode: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateQRCode`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly updateContent: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateContent`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly updateLogos: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateLogos`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly downloadPdf: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DownloadPdf`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

}
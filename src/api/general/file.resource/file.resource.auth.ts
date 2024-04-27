import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class FileResourceAuth {

    static readonly _baseContext = `General.FileResource`;

    static readonly upload: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Upload`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly rename: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Rename`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly searchAndDownload: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.SearchAndDownload`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.Search,
        OptionalUserAuth    : true,
        CustomAuthorization : true,
    };

    static readonly downloadByVersionName: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.DownloadByVersionName`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.GetOne,
        CustomAuthorization : true,
        OptionalUserAuth    : true,
    };

    static readonly downloadByVersionId: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.DownloadByVersionId`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.GetOne,
        CustomAuthorization : true,
        OptionalUserAuth    : true,
    };

    static readonly downloadById: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.DownloadById`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.GetOne,
        CustomAuthorization : true,
        OptionalUserAuth    : true,
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.Search,
    };

    static readonly getVersionById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetVersionById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getVersions: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetVersions`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getResourceInfo: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetResourceInfo`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly deleteVersionByVersionId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteVersionByVersionId`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

    static readonly delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

}

import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class FileResourceAuth {

    static _baseContext = `General.FileResource`;

    static upload: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Upload`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.CreateOne,
    };

    static rename: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Rename`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.UpdateOne,
    };

    static update: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Update`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.UpdateOne,
    };

    static searchAndDownload: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.SearchAndDownload`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.GetOne,
    };

    static downloadByVersionName: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.DownloadByVersionName`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.Search,
    };

    static downloadByVersionId: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.DownloadByVersionId`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.Search,
    };

    static downloadById: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.DownloadById`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.Search,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Search`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.Search,
    };

    static getVersionById: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.GetVersionById`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.GetOne,
    };

    static getVersions: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.GetVersions`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.GetOne,
    };

    static getResourceInfo: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.GetResourceInfo`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.GetOne,
    };

    static deleteVersionByVersionId: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.DeleteVersionByVersionId`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.DeleteOne,
    };

    static delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Delete`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.DeleteOne,
    };
}
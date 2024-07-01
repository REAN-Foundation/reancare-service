import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class DailyStatisticsAuth {

    static readonly _baseContext = `Statistics.DailyStatistics`;

    static readonly getDailyTenantStats: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetDailyTenantStats`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getDailySystemStats: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetDailySystemStats`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

}

import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class DailyStatisticsAuth {

    static _baseContext = `Statistics.DailyStatistics`;

    static getDailyTenantStats: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetDailyTenantStats`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static getDailySystemStats: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.getDailySystemStats`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

}

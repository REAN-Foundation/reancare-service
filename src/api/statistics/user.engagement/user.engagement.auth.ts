import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserEngagementAuth {

    static _baseContext = `Statistics.UserEngagement.`;

    static getUserEngagementStatsByYear: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserEngagementStatsByYear`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static getUserEngagementStatsByQuarter: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserEngagementStatsByQuarter`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static getUserEngagementStatsByMonth: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserEngagementStatsByMonth`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static getUserEngagementStatsByWeek: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserEngagementStatsByWeek`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static getUserEngagementStatsByDateRange: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserEngagementStatsByDateRange`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static getUserEngagementStatsForUser: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserEngagementStatsForUser`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

}

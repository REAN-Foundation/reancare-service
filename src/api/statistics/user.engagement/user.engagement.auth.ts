import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserEngagementAuth {

    static readonly _baseContext = `Statistics.UserEngagement.`;

    static readonly getUserEngagementStatsByYear: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserEngagementStatsByYear`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getUserEngagementStatsByQuarter: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserEngagementStatsByQuarter`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getUserEngagementStatsByMonth: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserEngagementStatsByMonth`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getUserEngagementStatsByWeek: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserEngagementStatsByWeek`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getUserEngagementStatsByDateRange: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserEngagementStatsByDateRange`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getUserEngagementStatsForUser: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserEngagementStatsForUser`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

}

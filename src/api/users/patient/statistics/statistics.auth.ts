import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class StatisticsAuth {

    static readonly _baseContext = 'User.Patient.Statistics';

    static readonly getPatientStatsReport: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPatientStatsReport`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getPatientStats: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPatientStats`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant, //Could be public?
        RequestType : RequestType.GetMany,
    };

    static readonly getPatientHealthSummary: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPatientHealthSummary`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant, //Could be public?
        RequestType : RequestType.GetMany,
    };

    static readonly createReportSettings: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReportSettings`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static readonly getReportSettingsByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetReportSettingsByUserId`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.GetOne,
    };

    static readonly updateReportSettingsByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateReportSettingsByUserId`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

}

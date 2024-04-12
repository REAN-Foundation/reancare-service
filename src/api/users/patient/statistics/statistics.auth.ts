import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class StatisticsAuth {

    static _baseContext = 'User.Patient.Statistics';

    static getPatientStatsReport: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPatientStatsReport`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static getPatientStats: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPatientStats`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant, //Could be public?
        RequestType : RequestType.GetMany,
    };

    static getPatientHealthSummary: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPatientHealthSummary`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant, //Could be public?
        RequestType : RequestType.GetMany,
    };

    static createReportSettings: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReportSettings`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static getReportSettingsByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetReportSettingsByUserId`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.GetOne,
    };

    static updateReportSettingsByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateReportSettingsByUserId`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

}

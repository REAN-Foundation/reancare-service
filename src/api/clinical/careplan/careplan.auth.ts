import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class CareplanAuth {

    static readonly _baseContext = `Clinical.Careplan`;

    static readonly getPatientEligibility: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPatientEligibility`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getAvailableCareplans: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetAvailableCareplans`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetMany,
    };

    static readonly enroll: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Enroll`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly getPatientEnrollments: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPatientEnrollments`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly fetchTasks: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.FetchTasks`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetMany,
    };

    static readonly getWeeklyStatus: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetWeeklyStatus`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly updateRisk: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateRisk`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

    static readonly getPatientActiveEnrollments: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPatientActiveEnrollments`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetMany,
    };

    static readonly stop: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Stop`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

}

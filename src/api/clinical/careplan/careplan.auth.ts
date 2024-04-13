import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class CareplanAuth {

    static _baseContext = `Clinical.Careplan`;

    static getPatientEligibility: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPatientEligibility`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static getAvailableCareplans: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.GetAvailableCareplans`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.GetMany,
        CustomAuthorization : true,
    };

    static enroll: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Enroll`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static getPatientEnrollments: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPatientEnrollments`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static fetchTasks: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.FetchTasks`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetMany,
    };

    static getWeeklyStatus: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetWeeklyStatus`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static updateRisk: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateRisk`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

}

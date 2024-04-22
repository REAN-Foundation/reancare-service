import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicationConsumptionAuth {

    static _baseContext = `Clinical.Medications.MedicationConsumption`;

    static markListAsTaken: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.MarkListAsTaken`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateMany,
    };

    static markListAsMissed: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.MarkListAsMissed`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateMany,
    };

    static markAsTaken: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.MarkAsTaken`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static markAsMissed: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.MarkAsMissed`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static deleteFutureMedicationSchedules: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteFutureMedicationSchedules`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static searchForPatient: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.SearchForPatient`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static getScheduleForDuration: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetScheduleForDuration`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static getScheduleForDay: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetScheduleForDay`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static getSummaryForDay: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetSummaryForDay`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static getSummaryByCalendarMonths: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetSummaryByCalendarMonths`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,

    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.getById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

}

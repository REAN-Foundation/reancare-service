import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicationConsumptionAuth {

    static readonly _baseContext = `Clinical.Medications.MedicationConsumption`;

    static readonly markListAsTaken: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.MarkListAsTaken`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateMany,
    };

    static readonly markListAsMissed: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.MarkListAsMissed`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateMany,
    };

    static readonly markAsTaken: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.MarkAsTaken`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly markAsMissed: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.MarkAsMissed`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly deleteFutureMedicationSchedules: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteFutureMedicationSchedules`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly searchForPatient: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.SearchForPatient`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getScheduleForDuration: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetScheduleForDuration`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getScheduleForDay: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetScheduleForDay`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getSummaryForDay: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetSummaryForDay`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getSummaryByCalendarMonths: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetSummaryByCalendarMonths`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,

    };

    static readonly getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.getById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

}

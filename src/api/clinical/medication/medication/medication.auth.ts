import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicationAuth {

    static readonly _baseContext = `Clinical.Medications.Medication`;

    static readonly getTimeSchedules: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetTimeSchedules`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static readonly getFrequencyUnits: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetFrequencyUnits`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static readonly getDosageUnits: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetDosageUnits`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

    static readonly getDurationUnits: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetDurationUnits`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static readonly getAdministrationRoutes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetAdministrationRoutes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static readonly getStockMedicationImages: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetStockMedicationImages`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static readonly downloadStockMedicationImageById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DownloadStockMedicationImageById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

    static readonly getStockMedicationImageById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetStockMedicationImageById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.Search`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.Search,
        CustomAuthorization : true,
    };

    static readonly getCurrentMedications: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetCurrentMedications`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

}

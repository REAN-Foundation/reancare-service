import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class MedicationAuth {

    static _baseContext = `Clinical.Medications.Medication`;

    static getTimeSchedules: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetTimeSchedules`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getFrequencyUnits: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetFrequencyUnits`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getDosageUnits: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetDosageUnits`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

    static getDurationUnits: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetDurationUnits`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getAdministrationRoutes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetAdministrationRoutes`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getStockMedicationImages: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetStockMedicationImages`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static downloadStockMedicationImageById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DownloadStockMedicationImageById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

    static getStockMedicationImageById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetStockMedicationImageById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

    static create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.Search`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.Search,
        CustomAuthorization : true,
    };

    static getCurrentMedications: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetCurrentMedications`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

}

import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class PregnancyAuth {

    static readonly _baseContext = `Clinical.Maternity.Pregnancy`;

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
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

    static readonly getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.Search`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.Search,
        CustomAuthorization : true,
    };

    static readonly createAntenatalVisit: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateAntenatalVisit`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly updateAntenatalVisit: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateAntenatalVisit`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly deleteAntenatalVisit: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteAntenatalVisit`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

    static readonly getAntenatalVisitById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetAntenatalVisitById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly createAntenatalMedication: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateAntenatalMedication`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly updateAntenatalMedication: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateAntenatalMedication`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly deleteAntenatalMedication: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteAntenatalMedication`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

    static readonly getAntenatalMedicationById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetAntenatalMedicationById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly createTest: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateTest`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly updateTest: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateTest`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly deleteTest: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteTest`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

    static readonly getTestById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetTestById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };
}



import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class DeliveryAuth {

    static readonly _baseContext = `Clinical.Maternity.Delivery`;

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

    static readonly createPostnatalVisit: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreatePostnatalVisit`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly updatePostnatalVisit: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdatePostnatalVisit`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly deletePostnatalVisit: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeletePostnatalVisit`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

    static readonly getPostnatalVisitById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPostnatalVisitById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly searchPostnatalVisits: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.SearchPostnatalVisits`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.Search,
        CustomAuthorization : true,
    };

    static readonly createPostnatalMedication: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreatePostnatalMedication`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly updatePostnatalMedication: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdatePostnatalMedication`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly deletePostnatalMedication: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeletePostnatalMedication`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

    static readonly getPostnatalMedicationById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPostnatalMedicationById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly createComplication: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateComplication`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly updateComplication: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateComplication`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly deleteComplication: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteComplication`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

    static readonly getComplicationById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetComplicationById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly searchComplications: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.SearchComplications`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.Search,
        CustomAuthorization : true,
    };

    static readonly createBaby: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateBaby`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly getBabyById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetBabyById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly createBreastfeeding: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateBreastfeeding`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly updateBreastfeeding: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateBreastfeeding`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly getBreastfeedingById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetBreastfeedingById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

}

///////////////////////////////////////////////////////////////////////////////////////


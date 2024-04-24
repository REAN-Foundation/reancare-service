import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentTemplateAuth {

    static readonly _baseContext = `Clinical.Assessments.SymptomAssessmentTemplate`;

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.System,
        RequestType : RequestType.CreateOne,
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.System,
        RequestType : RequestType.Search,
    };

    static readonly getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    static readonly update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.System,
        RequestType : RequestType.UpdateOne,
    };

    static readonly delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.System,
        RequestType : RequestType.DeleteOne,
    };

    static readonly addSymptomTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.AddSymptomTypes`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.System,
        RequestType : RequestType.UpdateOne,
    };

    static readonly removeSymptomTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.RemoveSymptomTypes`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.System,
        RequestType : RequestType.UpdateOne,
    };

}

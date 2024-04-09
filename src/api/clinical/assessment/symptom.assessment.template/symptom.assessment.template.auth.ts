import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentTemplateAuth {

    static _baseContext = `Clinical.Assessments.SymptomAssessmentTemplate`;

    static create: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Create`,
        Ownership  : ResourceOwnership.Tenant,
        ActionScope: ActionScope.System,
        RequestType: RequestType.CreateOne,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Search`,
        Ownership  : ResourceOwnership.Tenant,
        ActionScope: ActionScope.System,
        RequestType: RequestType.Search,
    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.GetById`,
        Ownership  : ResourceOwnership.Tenant,
        ActionScope: ActionScope.System,
        RequestType: RequestType.GetOne,
    };

    static update: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Update`,
        Ownership  : ResourceOwnership.Tenant,
        ActionScope: ActionScope.System,
        RequestType: RequestType.UpdateOne,
    };

    static delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Delete`,
        Ownership  : ResourceOwnership.Tenant,
        ActionScope: ActionScope.System,
        RequestType: RequestType.DeleteOne,
    };

    static addSymptomTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.AddSymptomTypes`,
        Ownership  : ResourceOwnership.Tenant,
        ActionScope: ActionScope.System,
        RequestType: RequestType.UpdateOne,
    };

    static removeSymptomTypes: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.RemoveSymptomTypes`,
        Ownership  : ResourceOwnership.Tenant,
        ActionScope: ActionScope.System,
        RequestType: RequestType.UpdateOne,
    };

}
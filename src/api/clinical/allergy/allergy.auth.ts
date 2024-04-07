import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class AllergyAuth {

    static _baseContext = `Clinical.Allergy`;

    static getAllergenCategories: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.GetAllergenCategories`,
        Ownership  : ResourceOwnership.System,
        ActionScope: ActionScope.Public,
        RequestType: RequestType.GetMany,
    };

    static getAllergenExposureRoutes: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.GetAllergenExposureRoutes`,
        Ownership  : ResourceOwnership.System,
        ActionScope: ActionScope.Public,
        RequestType: RequestType.GetMany,
    };

    static create: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Create`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.CreateOne,
    };

    static update: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Update`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.UpdateOne,
    };

    static delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Delete`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.DeleteOne,
    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.GetById`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.GetOne,
    };

    static getForPatient: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.GetForPatient`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.GetMany,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.Search`,
        Ownership          : ResourceOwnership.Owner,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.Search,
        CustomAuthorization: true,
    };

}
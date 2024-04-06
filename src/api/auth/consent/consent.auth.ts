import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ConsentAuth {

    static _baseContext = `Auth.Consent`;

    static create: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Create`,
        ActionScope: ActionScope.Owner,
        Ownership  : ResourceOwnership.Owner,
        RequestType: RequestType.CreateOne,
    };

    static update: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Update`,
        ActionScope: ActionScope.Owner,
        Ownership  : ResourceOwnership.Owner,
        RequestType: RequestType.UpdateOne,
    };

    static delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Delete`,
        ActionScope: ActionScope.Owner,
        Ownership  : ResourceOwnership.Owner,
        RequestType: RequestType.DeleteOne,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Search`,
        ActionScope: ActionScope.Tenant,
        Ownership  : ResourceOwnership.System,
        RequestType: RequestType.Search,
    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.GetById`,
        ActionScope: ActionScope.Tenant,
        Ownership  : ResourceOwnership.Tenant,
        RequestType: RequestType.GetOne,
    };
    
}

import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope,
    DefaultAuthOptions
} from '../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class RoleAuth {

    static _baseContext = 'Role';

    static create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.CreateOne,
    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetMany,
    };

    static update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.UpdateOne,
    };

    static delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.DeleteOne,
    };
    
}

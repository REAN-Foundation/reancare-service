import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope 
} from '../../../auth/auth.types';

export class ConsentAuth {

    static _baseContext = `Auth.Consent`;

    static create: AuthOptions = {
        Context               : `${this._baseContext}.Create`,
        Visibility            : ActionScope.Owner,
        Ownership             : ResourceOwnership.Owner,
        RequestType           : RequestType.CreateOne,
        ClientAppAuth         : true,
        ControllerAuth        : false,
        CustomAuthorizationFun: null,
    };

    static update: AuthOptions = {
        Context               : `${this._baseContext}.Update`,
        Visibility            : ActionScope.Owner,
        Ownership             : ResourceOwnership.Owner,
        RequestType           : RequestType.UpdateOne,
        ClientAppAuth         : true,
        ControllerAuth        : false,
        CustomAuthorizationFun: null,
    };

    static delete: AuthOptions = {
        Context               : `${this._baseContext}.Delete`,
        Visibility            : ActionScope.Owner,
        Ownership             : ResourceOwnership.Owner,
        RequestType           : RequestType.DeleteOne,
        ClientAppAuth         : true,
        ControllerAuth        : false,
        CustomAuthorizationFun: null,
    };

    static search: AuthOptions = {
        Context               : `${this._baseContext}.Search`,
        Visibility            : ActionScope.Tenant,
        Ownership             : ResourceOwnership.NotApplicable,
        RequestType           : RequestType.Search,
        ClientAppAuth         : true,
        ControllerAuth        : false,
        CustomAuthorizationFun: null,
    };

    static getById: AuthOptions = {
        Context               : `${this._baseContext}.GetById`,
        Visibility            : ActionScope.Tenant,
        Ownership             : ResourceOwnership.Tenant,
        RequestType           : RequestType.GetOne,
        ClientAppAuth         : true,
        ControllerAuth        : false,
        CustomAuthorizationFun: null,
    };
    
}

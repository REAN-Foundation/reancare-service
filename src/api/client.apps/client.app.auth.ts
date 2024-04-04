import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope,
    AuthResult
} from '../../auth/auth.types';

export class ClientAppAuth {

    static _baseContext = `ClientApp`;

    static create: AuthOptions = {
        Context               : `${this._baseContext}.Create`,
        Visibility            : ActionScope.System,
        Ownership             : ResourceOwnership.System,
        RequestType           : RequestType.CreateOne,
        ClientAppAuth         : true,
        ControllerAuth        : false,
        CustomAuthorizationFun: null,
    };

    static update: AuthOptions = {
        Context               : `${this._baseContext}.Update`,
        Visibility            : ActionScope.System,
        Ownership             : ResourceOwnership.System,
        RequestType           : RequestType.UpdateOne,
        ClientAppAuth         : true,
        ControllerAuth        : false,
        CustomAuthorizationFun: null,
    };

    static delete: AuthOptions = {
        Context               : `${this._baseContext}.Delete`,
        Visibility            : ActionScope.System,
        Ownership             : ResourceOwnership.System,
        RequestType           : RequestType.DeleteOne,
        ClientAppAuth         : true,
        ControllerAuth        : false,
        CustomAuthorizationFun: null,
    };

    static search: AuthOptions = {
        Context               : `${this._baseContext}.Search`,
        Visibility            : ActionScope.System,
        Ownership             : ResourceOwnership.NotApplicable,
        RequestType           : RequestType.Search,
        ClientAppAuth         : true,
        ControllerAuth        : false,
        CustomAuthorizationFun: null,
    };

    static getById: AuthOptions = {
        Context               : `${this._baseContext}.GetById`,
        Visibility            : ActionScope.System,
        Ownership             : ResourceOwnership.System,
        RequestType           : RequestType.GetOne,
        ClientAppAuth         : true,
        ControllerAuth        : false,
        CustomAuthorizationFun: null,
    };

    static getCurrentApiKey: AuthOptions = {
        Context               : `${this._baseContext}.GetCurrentApiKey`,
        Visibility            : ActionScope.System,
        Ownership             : ResourceOwnership.System,
        RequestType           : RequestType.Custom,
        ClientAppAuth         : false,
        ControllerAuth        : true,
        CustomAuthorizationFun: null,
    };

    static renewApiKey: AuthOptions = {
        Context               : `${this._baseContext}.RenewApiKey`,
        Visibility            : ActionScope.System,
        Ownership             : ResourceOwnership.System,
        RequestType           : RequestType.Custom,
        ClientAppAuth         : false,
        ControllerAuth        : true,
        CustomAuthorizationFun: null,
    };

}

// CustomAuthorizationFun: async (request: any) => {
//     const authResult: AuthResult = {
//         Result       : true,
//         Message      : 'Authorized',
//         HttpErrorCode: 200,
//     };
//     return authResult;
// },
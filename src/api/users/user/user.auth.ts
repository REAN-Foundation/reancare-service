import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserAuth {

    static _baseContext = 'User.User';

    static create: AuthOptions = {
        ...DefaultAuthOptions,
        Context       : `${this._baseContext}.Create`,
        Ownership     : ResourceOwnership.System,
        ActionScope   : ActionScope.Public,
        RequestType   : RequestType.CreateOne,
        SignupOrSignin: true
    };

    static loginWithPassword: AuthOptions = {
        ...DefaultAuthOptions,
        Context       : `${this._baseContext}.LoginWithPassword`,
        Ownership     : ResourceOwnership.System,
        ActionScope   : ActionScope.Public,
        RequestType   : RequestType.UpdateOne,
        SignupOrSignin: true
    };

    static loginWithOtp: AuthOptions = {
        ...DefaultAuthOptions,
        Context       : `${this._baseContext}.LoginWithOtp`,
        Ownership     : ResourceOwnership.System,
        ActionScope   : ActionScope.Public,
        RequestType   : RequestType.UpdateOne,
        SignupOrSignin: true,
    };

    static generateOtp: AuthOptions = {
        ...DefaultAuthOptions,
        Context       : `${this._baseContext}.GenerateOtp`,
        Ownership     : ResourceOwnership.System,
        ActionScope   : ActionScope.Public,
        RequestType   : RequestType.UpdateOne,
        SignupOrSignin: true,
    };

    static rotateUserAccessToken: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.RotateUserAccessToken`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.UpdateOne,
    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static logout: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Logout`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetMany,
    };

    static resetPassword: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.ResetPassword`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

    /////////////////////////////////////////////////////////

    static getUserByRoleAndPhone: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserByRoleAndPhone`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    static getUserByRoleAndEmail: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserByRoleAndEmail`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    static getTenantUserByRoleAndPhone: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetTenantUserByRoleAndPhone`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    static getTenantUserByRoleAndEmail: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetTenantUserByRoleAndEmail`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    static getTenantsForUserWithPhone: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetTenantsForUserWithPhone`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetMany,
    };

    static getTenantsForUserWithEmail: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetTenantsForUserWithEmail`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetMany,
    };

    /////////////////////////////////////////////////////////

    // The following are implicitly handled through concrete roles
    // or by other means
    // static update: AuthOptions = {
    //     ...DefaultAuthOptions,
    //     Context     : `${this._baseContext}.Update`,
    //     Ownership   : ResourceOwnership.System,
    //     ActionScope : ActionScope.System,
    //     RequestType : RequestType.UpdateOne,
    // };

    // static delete: AuthOptions = {
    //     ...DefaultAuthOptions,
    //     Context     : `${this._baseContext}.Delete`,
    //     Ownership   : ResourceOwnership.System,
    //     ActionScope : ActionScope.System,
    //     RequestType : RequestType.DeleteOne,
    // };
    
}

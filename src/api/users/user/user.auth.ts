import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserAuth {

    static readonly _baseContext = 'User.User';

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.Create`,
        Ownership      : ResourceOwnership.System,
        ActionScope    : ActionScope.System,
        RequestType    : RequestType.CreateOne,
    };

    static readonly loginWithPassword: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.LoginWithPassword`,
        Ownership      : ResourceOwnership.System,
        ActionScope    : ActionScope.Public,
        RequestType    : RequestType.UpdateOne,
        SignupOrSignin : true
    };

    static readonly loginWithOtp: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.LoginWithOtp`,
        Ownership      : ResourceOwnership.System,
        ActionScope    : ActionScope.Public,
        RequestType    : RequestType.UpdateOne,
        SignupOrSignin : true,
    };

    static readonly generateOtp: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.GenerateOtp`,
        Ownership      : ResourceOwnership.System,
        ActionScope    : ActionScope.Public,
        RequestType    : RequestType.UpdateOne,
        SignupOrSignin : true,
    };

    static readonly rotateUserAccessToken: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.RotateUserAccessToken`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.UpdateOne,
    };

    static readonly getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly logout: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Logout`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetMany,
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
    
    static readonly sendPasswordResetCode: AuthOptions = {
        ...DefaultAuthOptions,
        Context       : `${this._baseContext}.SendPasswordResetCode`,
        Ownership     : ResourceOwnership.System,
        ActionScope   : ActionScope.Public,
        RequestType   : RequestType.UpdateOne,
        SignupOrSignin: true,
    };

    static readonly resetPassword: AuthOptions = {
        ...DefaultAuthOptions,
        Context       : `${this._baseContext}.ResetPassword`,
        Ownership     : ResourceOwnership.System,
        ActionScope   : ActionScope.Public,
        RequestType   : RequestType.UpdateOne,
        SignupOrSignin: true,
    };

    static readonly changePassword: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.ChangePassword`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

    /////////////////////////////////////////////////////////

    // Marked for the deprecation
    static readonly getUserByRoleAndPhone: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserByRoleAndPhone`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

    // Marked for the deprecation
    static readonly getUserByRoleAndEmail: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserByRoleAndEmail`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    // Marked for the deprecation
    static readonly getTenantUserByRoleAndPhone: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetTenantUserByRoleAndPhone`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    // Marked for the deprecation
    static readonly getTenantUserByRoleAndEmail: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetTenantUserByRoleAndEmail`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetOne,
    };

    static readonly getTenantsForUserWithPhone: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetTenantsForUserWithPhone`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetMany,
    };

    static readonly getTenantsForUserWithEmail: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetTenantsForUserWithEmail`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetMany,
    };

    static readonly deleteProfileImage: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteProfileImage`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    /////////////////////////////////////////////////////////

    static readonly validateUserById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.ValidateUserById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

    // The following are implicitly handled through concrete roles
    // or by other means
    // static readonly update: AuthOptions = {
    //     ...DefaultAuthOptions,
    //     Context     : `${this._baseContext}.Update`,
    //     Ownership   : ResourceOwnership.System,
    //     ActionScope : ActionScope.System,
    //     RequestType : RequestType.UpdateOne,
    // };

    // static readonly delete: AuthOptions = {
    //     ...DefaultAuthOptions,
    //     Context     : `${this._baseContext}.Delete`,
    //     Ownership   : ResourceOwnership.System,
    //     ActionScope : ActionScope.System,
    //     RequestType : RequestType.DeleteOne,
    // };

}

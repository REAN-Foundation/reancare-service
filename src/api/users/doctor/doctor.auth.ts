import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class DoctorAuth {

    static readonly _baseContext = 'User.Doctor';

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.Create`,
        Ownership      : ResourceOwnership.Owner,
        ActionScope    : ActionScope.Tenant,
        RequestType    : RequestType.CreateOne,
        SignupOrSignin : true
    };

    static readonly getByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetByUserId`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetMany,
    };

    static readonly updateByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateByUserId`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly deleteByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteByUserId`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.DeleteOne,
    };

}

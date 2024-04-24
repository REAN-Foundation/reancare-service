import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientAuth {

    static readonly _baseContext = 'User.Patient.Patient';

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.Create`,
        Ownership      : ResourceOwnership.Owner,
        ActionScope    : ActionScope.Tenant,
        RequestType    : RequestType.CreateOne,
        SignupOrSignin : true
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.Search,
    };

    static readonly getByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.GetByUserId`,
        Ownership      : ResourceOwnership.Owner,
        ActionScope    : ActionScope.Tenant,
        RequestType    : RequestType.GetOne,
        ResourceIdName : 'userId'
    };

    static readonly updateByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.UpdateByUserId`,
        Ownership      : ResourceOwnership.Owner,
        ActionScope    : ActionScope.Tenant,
        RequestType    : RequestType.UpdateOne,
        ResourceIdName : 'userId'
    };

    static readonly deleteByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.DeleteByUserId`,
        Ownership      : ResourceOwnership.Owner,
        ActionScope    : ActionScope.Owner,
        RequestType    : RequestType.DeleteOne,
        ResourceIdName : 'userId'
    };

    //To be deprecated
    static readonly getPatientByPhone: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.GetPatientByPhone`,
        Ownership      : ResourceOwnership.Owner,
        ActionScope    : ActionScope.Tenant,
        RequestType    : RequestType.GetOne,
        ResourceIdName : 'phone'
    };

    static readonly getByPhone: AuthOptions = {
        ...DefaultAuthOptions,
        Context        : `${this._baseContext}.GetByPhone`,
        Ownership      : ResourceOwnership.Owner,
        ActionScope    : ActionScope.Tenant,
        RequestType    : RequestType.GetOne,
        ResourceIdName : 'phone'
    };

}

import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientAuth {

    static _baseContext = 'User.Patient.Patient';

    static create: AuthOptions = {
        ...DefaultAuthOptions,
        Context          : `${this._baseContext}.Create`,
        Ownership        : ResourceOwnership.Owner,
        ActionScope      : ActionScope.Tenant,
        RequestType      : RequestType.CreateOne,
        UserRegistration : true
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.Search,
    };

    static getByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetByUserId`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
        ResourceIdName: 'userId'
    };

    static updateByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateByUserId`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
        ResourceIdName: 'userId'
    };

    static deleteByUserId: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteByUserId`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.DeleteOne,
        ResourceIdName: 'userId'
    };

    //To be deprecated
    static getPatientByPhone: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPatientByPhone`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
        ResourceIdName: 'phone'
    };

    static getByPhone: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetByPhone`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
        ResourceIdName: 'phone'
    };

}
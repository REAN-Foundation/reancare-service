import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope,
    DefaultAuthOptions
} from '../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class PersonAuth {

    static _baseContext = 'Person';

    static getAllPersonsWithPhoneAndRole: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetAllPersonsWithPhoneAndRole`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetMany,
    };

    static getAllPersonsWithPhone: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetAllPersonsWithPhone`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetMany,
    };

    static getOrganizations: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetOrganizations`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetMany,
    };

    static addAddress: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.AddAddress`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

    static removeAddress: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.RemoveAddress`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

    static getAddresses: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetAddresses`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetMany,
    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

}

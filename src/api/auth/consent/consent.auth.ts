import { RoleBasedPermissionHandler } from '../../../auth/custom/role.specific.permissions';
import express from 'express';
import { ConsentCreateModel } from '../../../domain.types/auth/consent.types';
import { ApiError } from '../../../common/api.error';
import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope 
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ConsentAuth {

    static _baseContext = `Auth.Consent`;

    static create: AuthOptions = {
        Context               : `${this._baseContext}.Create`,
        ActionScope           : ActionScope.Owner,
        Ownership             : ResourceOwnership.Owner,
        RequestType           : RequestType.CreateOne,
        ClientAppAuth         : true,
        ControllerAuth        : false,
        CustomAuthorizationFun: null,
        AlternateAuth         : false,
    };

    static checkPermissionsCreate = async (
        request: express.Request, model: ConsentCreateModel): Promise<void> => {

    }

    static update: AuthOptions = {
        Context               : `${this._baseContext}.Update`,
        ActionScope           : ActionScope.Owner,
        Ownership             : ResourceOwnership.Owner,
        RequestType           : RequestType.UpdateOne,
        ClientAppAuth         : true,
        ControllerAuth        : false,
        CustomAuthorizationFun: null,
        AlternateAuth         : false,
    };

    static delete: AuthOptions = {
        Context               : `${this._baseContext}.Delete`,
        ActionScope           : ActionScope.Owner,
        Ownership             : ResourceOwnership.Owner,
        RequestType           : RequestType.DeleteOne,
        ClientAppAuth         : true,
        ControllerAuth        : false,
        CustomAuthorizationFun: null,
        AlternateAuth         : false,
    };

    static search: AuthOptions = {
        Context               : `${this._baseContext}.Search`,
        ActionScope           : ActionScope.Tenant,
        Ownership             : ResourceOwnership.NotApplicable,
        RequestType           : RequestType.Search,
        ClientAppAuth         : true,
        ControllerAuth        : false,
        CustomAuthorizationFun: null,
        AlternateAuth         : false,
    };

    static getById: AuthOptions = {
        Context               : `${this._baseContext}.GetById`,
        ActionScope           : ActionScope.Tenant,
        Ownership             : ResourceOwnership.Tenant,
        RequestType           : RequestType.GetOne,
        ClientAppAuth         : true,
        ControllerAuth        : false,
        CustomAuthorizationFun: null,
        AlternateAuth         : false,
    };
    
}

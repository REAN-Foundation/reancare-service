import { RoleBasedPermissionHandler } from '../../../../auth/custom/role.specific.permissions';
import express from 'express';
import { BloodCholesterolDomainModel } from '../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.domain.model';
import { BloodCholesterolSearchFilters } from '../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.search.types';
import { ApiError } from '../../../../common/api.error';
import { PermissionHandler } from '../../../../auth/custom/permission.handler';
import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodCholesterolAuth {

    static _baseContext = `Clinical.Biometrics.BloodCholesterol`;

    static create: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Create`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.CreateOne,
    };

    static update: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Update`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.UpdateOne,
    };

    static delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Delete`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.DeleteOne,
    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.GetById`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.GetOne,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.Search`,
        Ownership          : ResourceOwnership.Owner,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.Search,
        CustomAuthorization: true,
    };

}

///////////////////////////////////////////////////////////////////////////////////////


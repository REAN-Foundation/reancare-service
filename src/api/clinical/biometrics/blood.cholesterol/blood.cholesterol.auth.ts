import { RoleBasedPermissionHandler } from '../../../../auth/custom/role.specific.permissions';
import express from 'express';
import { BloodCholesterolDomainModel } from '../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.domain.model';
import { BloodCholesterolSearchFilters } from '../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.search.types';
import { ApiError } from '../../../../common/api.error';
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

    static authorizeSearch = async (
        request: express.Request,
        searchFilters: BloodCholesterolSearchFilters) => {

        const currentUser = request.currentUser;
        const ownership = request.ownership;
        const actionScope = request.actionScope;
        const isOwner = request.resourceOwnerUserId === currentUser.UserId;
        const areTenantsSame = request.resourceTenantId === currentUser.TenantId;

        const customAuthorization = request.customAuthorization;

        if (searchFilters.PatientUserId != null) {

            if (searchFilters.PatientUserId !== request.currentUser.UserId) {
                searchFilters['TenantId'] = currentUser.TenantId;
                
                
                if (actionScope === ActionScope.Tenant) {
                    
                }
                if (ownership === ResourceOwnership.Owner) {
                    if (actionScope === ActionScope.Owner) {
                        throw new ApiError(403, `Unauthorized`);
                        //Handle it through custom authorization
                        // return customAuthorization;
                    }
    
                }
            }
            else {
                searchFilters.PatientUserId = currentUser.UserId;
            }
        }
        else {
            searchFilters.PatientUserId = currentUser.UserId;
        }

        else if(searchFilters.PatientUserId === request.currentUser.UserId) {

        if (searchFilters.PatientUserId != null) {

        }

        searchFilters.PatientUserId = request.currentUser.UserId;
        searchFilters.TenantId = request.currentUser.TenantId;

        searchFilters.
    };

}

///////////////////////////////////////////////////////////////////////////////////////


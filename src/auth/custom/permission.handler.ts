import express from 'express';
import { Logger } from '../../common/logger';
import { Roles } from '../../domain.types/role/role.types';
import { CurrentUser } from '../../domain.types/miscellaneous/current.user';
import { RolePrivilegeService } from '../../services/role/role.privilege.service';
import { ConsentService } from '../../services/auth/consent.service';
import { Injector } from '../../startup/injector';

//////////////////////////////////////////////////////////////

export class PermissionHandler {

    public static hasRoleBasedPermission = async (roleId, context) => {
        const rolePrivilegeService = Injector.Container.resolve(RolePrivilegeService);
        const hasPrivilege = await rolePrivilegeService.hasPrivilegeForRole(roleId, context);
        if (!hasPrivilege) {
            return false;
        }
        return true;
    };

    public static checkPermissions = async (request: express.Request): Promise<boolean> => {

        const currentUser = request.currentUser;
        const context = request.context;

        if (currentUser == null) {
            return false;
        }

        if (context == null || context === 'undefined') {
            return false;
        }

        const currentUserRole = currentUser.CurrentRole;

        // 1. SuperAdmin (System Admin) has access to all resources
        if (currentUserRole === Roles.SystemAdmin) {
            return true;
        }

        // 2. Check if the current role has permission for this context
        const hasRoleBasedPermission = await PermissionHandler.hasRoleBasedPermission(
            currentUser.CurrentRoleId, context);
        if (!hasRoleBasedPermission) {
            return false;
        }

        // 3. SystemUser
        // System user access has already been checked for role based permissions
        if (currentUserRole === Roles.SystemUser) {
            Logger.instance().log('System user access has already been checked for role based permissions');
            return true;
        }

        // 4. Tenant Admin and Tenant User
        if (currentUserRole === Roles.TenantAdmin ||
            currentUserRole === Roles.TenantUser) {
            const permitted = await this.checkTenantRolePermissions(request, currentUser);
            return permitted;
        }

        // 5. Patient
        if (currentUserRole === Roles.Patient) {
            const permitted = await this.checkPermissionsForPatient(request, currentUser);
            return permitted;
        }

        // 6. Doctor
        if (currentUserRole === Roles.Doctor) {
            const permitted = await this.checkPermissionsForDoctor(request, currentUser);
            return permitted;
        }

        return false;
    };

    private static getResourceOwner_CreateRequest = (request: any): string => {
        var resourceOwnerUserId = null;
        if (request.requestType === 'Create') {
            //By default, any resource associated with patient is owned by the patient
            //This includes clinical entities, wellness entities, etc.
            if (request.body.PatientUserId != null && request.body.PatientUserId !== undefined) {
                resourceOwnerUserId = request.body.PatientUserId;
                request.patientOwnedResource = true;
                return resourceOwnerUserId;
            }
            //By default, any resource associated with user is owned by the user
            if (request.body.UserId != null && request.body.UserId !== undefined) {
                resourceOwnerUserId = request.body.UserId;
                return resourceOwnerUserId;
            }
        }
        return resourceOwnerUserId;
    };

    private static checkPermissionsForPatient = async (request: express.Request, currentUser: CurrentUser)
        : Promise<boolean> => {

        // Handle create requests for Patient Roles
        const isCreateRequest = request.requestType === 'Create';
        const resourceOwnerId_CreateReq = this.getResourceOwner_CreateRequest(request);

        if (isCreateRequest && request.patientOwnedResource) {
            // Patient can create only his own resources
            return resourceOwnerId_CreateReq === currentUser.UserId;
        }
        else if (request.singleResourceRequest) {
            if (request.resourceOwnerUserId) {
                // Patient can get, update or delete only his own resources
                return request.resourceOwnerUserId === currentUser.UserId;
            }
            //Ownership cannot be determined for the resource
            //Return true and let the request specific handler handle it
            request.customAuthorization = true;
            return true;
        }
        else if (request.requestType === 'Search') {
            // Patient can search only his own resources

            //Check request.query to limit it only to the patient's own resources
            const queryParams = request.query;
            if (queryParams == null || queryParams === undefined) {
                request.query = {};
                request.query["patientUserId"] = currentUser.UserId;
                request.query["userId"] = currentUser.UserId; //Add this to search for resources created by the patient
                request.query["tenantId"] = currentUser.TenantId;
            }
            else {
                if (queryParams.patientUserId == null || queryParams.patientUserId === undefined) {
                    request.query["patientUserId"] = currentUser.UserId;
                }
                if (queryParams.userId == null || queryParams.userId === undefined) {
                    request.query["userId"] = currentUser.UserId;
                }
                if (queryParams.tenantId == null || queryParams.tenantId === undefined) {
                    request.query["tenantId"] = currentUser.TenantId;
                }
            }
        }
        return true;
    };

    private static checkPermissionsForDoctor = async (request: express.Request, currentUser: CurrentUser)
        : Promise<boolean> => {

        const isCreateRequest = request.requestType === 'Create';
        const resourceOwnerId_CreateReq = this.getResourceOwner_CreateRequest(request);
        const isPatientOwnedResource = request.patientOwnedResource;

        const isTenantSame = request.resourceTenantId === currentUser.TenantId;
        if (!isTenantSame) {
            return false;
        }

        if (!isPatientOwnedResource) {

            if (isCreateRequest) {
                // Doctor can create only his own resources
                return resourceOwnerId_CreateReq === currentUser.UserId;
            }
            else if (request.singleResourceRequest) {
                if (request.resourceOwnerUserId) {
                    // Doctor can get, update or delete only his own resources
                    return request.resourceOwnerUserId === currentUser.UserId;
                }
                //Ownership cannot be determined for the resource
                //Return true and let the request specific handler handle it
                request.customAuthorization = true;
                return true;
            }
            else if (request.requestType === 'Search') {
                const queryParams = request.query;
                if (queryParams == null || queryParams === undefined) {
                    request.query = {};
                    request.query["userId"] = currentUser.UserId; //Add this to search for resources created by the patient
                    request.query["doctorUserId"] = currentUser.UserId;
                    request.query["tenantId"] = currentUser.TenantId;
                }
                else {
                    if (queryParams.userId == null || queryParams.userId === undefined) {
                        request.query["userId"] = currentUser.UserId;
                    }
                    if (queryParams.doctorUserId == null || queryParams.doctorUserId === undefined) {
                        request.query["doctorUserId"] = currentUser.UserId;
                    }
                    if (queryParams.tenantId == null || queryParams.tenantId === undefined) {
                        request.query["tenantId"] = currentUser.TenantId;
                    }
                }
            }
            return true;
        }
        else {
            //Patient owned resources are allowed to be created by patients
            //Provided they have consent from the patient
            const hasConsent = await this.hasConsent(request);
            if (!hasConsent) {
                return false;
            }

            if (request.requestType === 'Search') {
                const queryParams = request.query;
                if (queryParams == null || queryParams === undefined) {
                    request.query = {};
                    request.query["userId"] = request.resourceOwnerUserId;
                    request.query["patientUserId"] = request.resourceOwnerUserId;
                    request.query["tenantId"] = currentUser.TenantId;
                }
                else {
                    if (queryParams.userId == null || queryParams.userId === undefined) {
                        request.query["userId"] = request.resourceOwnerUserId;
                    }
                    if (queryParams.doctorUserId == null || queryParams.doctorUserId === undefined) {
                        request.query["patientUserId"] = request.resourceOwnerUserId;
                    }
                    if (queryParams.tenantId == null || queryParams.tenantId === undefined) {
                        request.query["tenantId"] = currentUser.TenantId;
                    }
                }
            }
        }
        return true;
    };

    private static checkTenantRolePermissions = async (request: express.Request, currentUser: CurrentUser) => {

        //Check if it is single resource request...
        if (request.singleResourceRequest) {
            //Check if the resource belongs to the same tenant
            if (currentUser.TenantId === request.resourceTenantId) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (request.requestType === 'Search') {
            //Check if the search request is limited to the tenant
            const queryParams = request.query;
            if (queryParams == null || queryParams === undefined) {
                request.query = {};
                request.query["tenantId"] = currentUser.TenantId;
            }
            else {
                if (queryParams.tenantId == null || queryParams.tenantId === undefined) {
                    request.query["tenantId"] = currentUser.TenantId;
                }
            }
            return true;
        }
        else {
            //Check if the context is DailyStatistics
            let context = request.context;
            context = context.toLowerCase();
            if (context.includes('DailyStatistics'.toLowerCase())) {
                return true;
            }
        }
        //Rest of the permissions are checked for role based permissions
        return false;
    };

    private static hasConsent = async (request: express.Request): Promise<boolean> => {

        const consentService = Injector.Container.resolve(ConsentService);
        const consents = await consentService.getActiveConsents(
            request.resourceOwnerUserId, request.currentUser.UserId, request.context);

        if (consents == null || consents.length === 0) {
            return false;
        }

        return true;
    };

}

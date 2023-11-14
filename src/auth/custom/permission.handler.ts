import express from 'express';
import { Logger } from '../../common/logger';
import { Roles } from '../../domain.types/role/role.types';
import { CurrentUser } from '../../domain.types/miscellaneous/current.user';

//////////////////////////////////////////////////////////////

export class PermissionHandler {

    public static checkPermissions = async (
        request: express.Request): Promise<boolean> => {

        const currentUser = request.currentUser;
        const context = request.context;

        const isSingleResourceReq = PermissionHandler.isSingleResourceRequest(request);

        if (currentUser == null) {
            return false;
        }

        if (context == null || context === 'undefined') {
            return false;
        }

        const currentUserRole = currentUser.CurrentRole;

        // SuperAdmin (System Admin) has access to all resources
        if (currentUserRole === Roles.SystemAdmin) {
            return true;
        }

        // SystemUser
        if (currentUserRole === Roles.SystemUser) {
            const permitted = await this.checkPermissionsForSystemUser(
                request, currentUser);
            return permitted;
        }

        // TenantAdmin
        if (currentUserRole === Roles.TenantAdmin) {
            const permitted = await this.checkPermissionsForTenantAdmin(
                request, currentUser);
            return permitted;
        }

        // TenantUser
        if (currentUserRole === Roles.TenantUser) {
            const permitted = await this.checkPermissionsForTenantUser(
                request, currentUser);
            return permitted;
        }

        if (currentUserRole === Roles.Patient) {
            const permitted = await this.checkPermissionsForPatient(
                request, currentUser);
            return permitted;
        }

        if (currentUserRole === Roles.Doctor) {
            const permitted = await this.checkPermissionsForDoctor(
                request, currentUser);
            return permitted;
        }

        // const specificToSingleUser =
        //     request.params.userId ||
        //     request.params.patientUserId ||
        //     request.params.resourceUserId ||
        //     request.body.ResourceUserId ||
        //     request.body.UserId ||
        //     request.body.PatientUserId;
        // If this request is specific to single resource

        if (isSingleResourceReq) {
            const isResourceOwner = await this.isResourceOwner(currentUser, request);
            if (isResourceOwner) {
                return true;
            }
            return false;
        }

        const hasConsent = await this.hasConsent(currentUser.CurrentRoleId, context);
        if (hasConsent) {
            return true;
        }

        return false;
    };

    private static isResourceOwner = async (user: CurrentUser, request: express.Request): Promise<boolean> => {
        if (request.resourceOwnerUserId == null) {
            return false;
        }
        if (request.resourceOwnerUserId === user.UserId) {
            return true;
        }
        return false;
    };

    private static hasConsent = async (currentRoleId: number, context: string): Promise<boolean> => {

        Logger.instance().log('Current role id: ' + currentRoleId);
        Logger.instance().log('Context: ' + context);

        //for time being, return true always
        return false;
    };

    private static isSingleResourceRequest = (request) => {
        return request.requestType === 'Create' ||
            request.requestType === 'Update' ||
            request.requestType === 'Delete' ||
            request.requestType === 'GetById';
    };

    private static checkPermissionsForSystemUser = (
        request: express.Request,
        currentUser: CurrentUser)
        : Promise<boolean> => {
        throw new Error('Function not implemented.');
    };

    private static checkPermissionsForTenantAdmin = (
        request: express.Request,
        currentUser: CurrentUser)
        : Promise<boolean> => {
        throw new Error('Function not implemented.');
    };

    private static checkPermissionsForTenantUser = (
        request: express.Request,
        currentUser: CurrentUser)
        : Promise<boolean> => {
        throw new Error('Function not implemented.');
    };

    private static checkPermissionsForPatient = (
        request: express.Request,
        currentUser: CurrentUser)
        : Promise<boolean> => {
        throw new Error('Function not implemented.');
    };

    private static checkPermissionsForDoctor = (
        request: express.Request,
        currentUser: CurrentUser)
        : Promise<boolean> => {
        throw new Error('Function not implemented.');
    };

}

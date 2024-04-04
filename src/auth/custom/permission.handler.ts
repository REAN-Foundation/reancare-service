import express from 'express';
import { RolePrivilegeService } from '../../services/role/role.privilege.service';
import { Injector } from '../../startup/injector';
import { ActionScope } from '../auth.types';

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

        const context = request.context;
        if (context == null || context === 'undefined') {
            return false;
        }

        // const systemOwnedResource = request.ownership === ResourceOwnership.System;
        const publicAccess = request.actionScope === ActionScope.Public;
        const customAuthorization = request.customAuthorization || request.controllerAuth;
        
        const currentUser = request.currentUser ?? null;
        if (!currentUser) {
            //If the user is not authenticated, then check if the resource access is public
            if (publicAccess && customAuthorization) {
                return true;
            }
        }

        // 1. Check if the current role has permission for this context
        const hasRoleBasedPermission = await PermissionHandler.hasRoleBasedPermission(currentUser.CurrentRoleId, context);
        if (!hasRoleBasedPermission) {
            return false;
        }

        return true;
        
    };

}

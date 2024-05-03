import express from 'express';
import { Logger } from '../../common/logger';
import { IUserAuthorizer } from '../interfaces/user.authorizer.interface';
import { Injector } from '../../startup/injector';
import { UserService } from '../../services/users/user/user.service';
import { RolePrivilegeService } from '../../services/role/role.privilege.service';
import { PermissionHandler } from './permission.handler';
import { ActionScope } from '../auth.types';

//////////////////////////////////////////////////////////////

export class CustomUserAuthorizer implements IUserAuthorizer {

    _userService: UserService = null;

    _rolePrivilegeService: any = null;

    constructor() {
        this._userService = Injector.Container.resolve(UserService);
        this._rolePrivilegeService = Injector.Container.resolve(RolePrivilegeService);
    }

    public authorize = async (request: express.Request): Promise<boolean> => {
        try {

            const context = request.context;
            if (context == null || context === 'undefined') {
                return false;
            }

            // Temp solution - Needs to be refined
            if (request.currentClient?.IsPrivileged) {
                return true;
            }

            const publicAccess = request.actionScope === ActionScope.Public;
            const optionalUserAuth = request.optionalUserAuth;

            const currentUser = request.currentUser ?? null;
            if (!currentUser) {
                //If the user is not authenticated, then check if the resource access is public
                if (publicAccess || optionalUserAuth) {
                    // To check whether a particular resource is available for public access, e.g. a profile image download
                    return true;
                }
                // If the resource is not public, then the user must be authenticated
                return false;
            }

            const hasPermission = await PermissionHandler.checkRoleBasedPermissions(request);
            return hasPermission;

        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

}

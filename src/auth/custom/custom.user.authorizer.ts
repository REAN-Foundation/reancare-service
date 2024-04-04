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

            // If the resource is not public, then the user must be authenticated
            if (request.actionScope != ActionScope.Public &&
                request.currentUser == null) {
                return true;
            }

            const hasPermission = await PermissionHandler.checkPermissions(request);
            return hasPermission;

        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

}

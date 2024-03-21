import express from 'express';
import { Logger } from '../../common/logger';
import { IUserAuthorizer } from '../interfaces/user.authorizer.interface';
import { Injector } from '../../startup/injector';
import { UserService } from '../../services/users/user/user.service';
import { RolePrivilegeService } from '../../services/role/role.privilege.service';
import { PermissionHandler } from './permission.handler';

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
            if (request.clientAppRoutes) {
                //This check is applicable only for the client app
                //specific endpoints.
                //Authorization for this is handled separately.
                //For all other endpoints, this check is not applicable.
                return true;
            }
            const context = request.context;
            if (context == null || context === 'undefined') {
                return false;
            }
            if (request.publicUrl) {
                return true;
            }
            const currentUser = request.currentUser;
            if (currentUser == null) {
                return false;
            }

            const hasPermission = await PermissionHandler.checkPermissions(request);
            return hasPermission;

        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

}

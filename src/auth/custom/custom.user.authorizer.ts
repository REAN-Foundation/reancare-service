import express from 'express';
import { Logger } from '../../common/logger';
import { IUserAuthorizer } from '../interfaces/user.authorizer.interface';
import { Injector } from '../../startup/injector';
import { UserService } from '../../services/users/user/user.service';
import { RolePrivilegeService } from '../../services/role/role.privilege.service';

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
            if (request.clientAppAuth) {
                //This check is applicable only for the client app
                //specific endpoints. For all other endpoints, this
                //check is not applicable.
                return true;
            }
            const currentUser = request.currentUser;
            const context = request.context;
            if (context == null || context === 'undefined') {
                return false;
            }
            if (currentUser == null) {
                return false;
            }
            const hasPrivilege = await this._rolePrivilegeService.hasPrivilegeForRole(
                currentUser.CurrentRoleId,
                context);

            if (!hasPrivilege) {
                return false;
            }

        } catch (error) {
            Logger.instance().log(error.message);
        }
        return false;
    };

}

import express from 'express';
import { Logger } from '../../common/logger';
import { Injector } from '../../startup/injector';
import { UserService } from '../../services/users/user/user.service';
import { RolePrivilegeService } from '../../services/role/role.privilege.service';
import ResourceService from '../../services/resource.service';
import { ResponseHandler } from '../../common/handlers/response.handler';

//////////////////////////////////////////////////////////////

export class ResourceHandler {

    _userService: UserService = Injector.Container.resolve(UserService);

    _rolePrivilegeService: any = Injector.Container.resolve(RolePrivilegeService);

    public extractResource = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        try {
            var resourceOwnerUserId = request.resourceOwnerUserId;
            var resourceTenantId = request.resourceTenantId;
            const resource = await ResourceService.getResource(request);
            if (resource != null) {
                resourceOwnerUserId = resource.PatientUserId ?? (resource.UserId ?? null);
                if (resourceOwnerUserId) {
                    const user = await this._userService.getById(resourceOwnerUserId);
                    resourceTenantId = user.TenantId;
                }
            }
            request.resourceOwnerUserId = resourceOwnerUserId;
            request.resourceTenantId = resourceTenantId;
            next();
        }
        catch (error) {
            Logger.instance().log(error.message);
            ResponseHandler.failure(request, response, 'User authentication error: ' + error.message, 401);
        }
    };

}

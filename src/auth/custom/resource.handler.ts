import express from 'express';
import { Logger } from '../../common/logger';
import { Injector } from '../../startup/injector';
import { UserService } from '../../services/users/user/user.service';
import { RolePrivilegeService } from '../../services/role/role.privilege.service';
import ResourceService from '../../services/resource.service';
import { ResponseHandler } from '../../common/handlers/response.handler';
import { Roles } from '../../domain.types/role/role.types';

////////////////////////////////////////////////////////////////////////////////////

export class ResourceHandler {

    _userService: UserService = Injector.Container.resolve(UserService);

    _rolePrivilegeService: any = Injector.Container.resolve(RolePrivilegeService);

    public extractResourceInfo = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        try {
            var resourceOwnerUserId = request.resourceOwnerUserId ?? null;
            var resourceTenantId = request.resourceTenantId ?? null;
            var patientOwnedResource = false;

            const resource = await ResourceService.getResource(request);
            if (resource != null) {
                resourceOwnerUserId = resource.PatientUserId ?? resource.UserId ?? resource.OwnerId ?? null;
                resourceTenantId = resource.TenantId ?? null;
                const getFromUser = resourceOwnerUserId && !resourceTenantId;
                if (getFromUser) {
                    const user = await this._userService.getById(resourceOwnerUserId);
                    resourceTenantId = user.TenantId;
                    if (user.Role.RoleName === Roles.Patient) {
                        patientOwnedResource = true;
                    }
                }
            }
            if (resourceOwnerUserId == null || resourceTenantId == null) {
                if (request.resourceType === 'Tenant.Tenants' ||
                    request.resourceType === 'Tenant.Settings') {
                    resourceTenantId = request.resourceId as string;
                    const tenantAdminUser =
                        await this._userService.getUserByTenantIdAndRole(resourceTenantId, Roles.TenantAdmin);
                    if (tenantAdminUser != null && resourceOwnerUserId == null) {
                        resourceOwnerUserId = tenantAdminUser.id;
                    }
                }
            }

            request.resourceOwnerUserId = resourceOwnerUserId;
            request.resourceTenantId = resourceTenantId;
            request.patientOwnedResource = patientOwnedResource;

            next();
        }
        catch (error) {
            Logger.instance().log(error.message);
            ResponseHandler.failure(request, response, 'User authentication error: ' + error.message, 401);
        }
    };

}

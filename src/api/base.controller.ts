
import express from "express";
import { uuid } from "../domain.types/miscellaneous/system.types";
import { ApiError } from "../common/api.error";
import { PermissionHandler } from "../auth/custom/permission.handler";
import { TenantService } from "../services/tenant/tenant.service";
import { Injector } from "../startup/injector";
import { UserService } from "../services/users/user/user.service";
import { Roles } from "../domain.types/role/role.types";

///////////////////////////////////////////////////////////////////////////////////////

export class BaseController {

    public authorizeOne = async (
        request: express.Request,
        resourceOwnerUserId?: uuid,
        resourceTenantId?: uuid): Promise<void> => {

        if (request.currentClient?.IsPrivileged) {
            return;
        }

        let ownerUserId = resourceOwnerUserId ?? null;
        let tenantId = resourceTenantId ?? null;

        if (ownerUserId) {
            const userService = Injector.Container.resolve(UserService);
            const user = await userService.getById(ownerUserId);
            if (user) {
                ownerUserId = user.id;
                tenantId = tenantId ?? user.TenantId;
            }
        }

        if (tenantId == null) {
            // If tenant is not provided, get the default tenant
            const tenantService = Injector.Container.resolve(TenantService);
            const tenant = await tenantService.getTenantWithCode('default');
            if (tenant) {
                tenantId = tenant.id;
            }
        }

        request.resourceOwnerUserId = ownerUserId;
        request.resourceTenantId = tenantId;

        const permitted = await PermissionHandler.checkFineGrained(request);
        if (!permitted) {
            throw new ApiError(403, 'Permission denied.');
        }
    };

    protected authorizeTenantSearch = (
        request: express.Request,
        filterTenantId?: string
    ): string | null => {

        if (request.currentClient?.IsPrivileged) {
            return filterTenantId ?? null;
        }

        const currentRole = request.currentUser.CurrentRole;

        if (filterTenantId != null) {
            if (filterTenantId !== request.currentUser.TenantId) {
                if (currentRole !== Roles.SystemAdmin &&
                    currentRole !== Roles.SystemUser) {
                    throw new ApiError(403, 'Forbidden');
                }
            }
            return filterTenantId;
        }

        if (currentRole === Roles.SystemAdmin ||
            currentRole === Roles.SystemUser) {
            return null;
        }

        return request.currentUser.TenantId;
    };

}

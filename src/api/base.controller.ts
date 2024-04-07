
import express from "express"
import { uuid } from "../domain.types/miscellaneous/system.types";
import { ApiError } from "../common/api.error";
import { PermissionHandler } from "../auth/custom/permission.handler";
import { TenantService } from "../services/tenant/tenant.service";
import { Injector } from "../startup/injector";
import { UserService } from "../services/users/user/user.service";

///////////////////////////////////////////////////////////////////////////////////////

export class BaseController {

    //#region member variables and constructors

    constructor() {
    }
    
    //#endregion

    public authorizeOne = async (
        request: express.Request, 
        resourceOwnerUserId?: uuid, 
        resourceTenantId?: uuid): Promise<void> => {

        let tenantId = resourceTenantId ?? null;
        if (tenantId == null) {
            const tenantService = Injector.Container.resolve(TenantService);
            var tenant = await tenantService.getTenantWithCode('default');
            if (tenant) {
                tenantId = tenant.id;
            }
        }

        let ownerUserId = resourceOwnerUserId ?? null;
        if (ownerUserId == null) {
            const currentUserId = request.currentUser?.UserId;
            const userService = Injector.Container.resolve(UserService);
            var user = await userService.getById(currentUserId);
            if (user) {
                ownerUserId = user.id;
            }
        }

        request.resourceOwnerUserId = ownerUserId;
        request.resourceTenantId = tenantId;

        const permitted = await PermissionHandler.checkFineGrained(request);
        if (!permitted) {
            throw new ApiError(403, 'Permission denied.');
        }
    };

    public authorize

}

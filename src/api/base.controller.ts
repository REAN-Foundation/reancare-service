
///////////////////////////////////////////////////////////////////////////////////////

import express from "express"
import { uuid } from "../domain.types/miscellaneous/system.types";
import { RoleBasedPermissionHandler } from "../auth/custom/role.specific.permissions";
import { ApiError } from "../common/api.error";

export class BaseController {

    //#region member variables and constructors

    constructor() {
    }
    //#endregion

    //#region Action methods

    public authorizeOne = async (
        request: express.Request, 
        resourceOwnerUserId: uuid, 
        resourceTenantId: uuid): Promise<void> => {
        request.resourceOwnerUserId = resourceOwnerUserId;
        request.resourceTenantId = resourceTenantId;
        const permitted = await RoleBasedPermissionHandler.checkRoleSpecificPermissions(request);
        if (!permitted) {
            throw new ApiError(403, 'Permission denied.');
        }
    };

    public authorizeSearch = async (
        request: express.Request, 
        resourceOwnerUserId: uuid, 
        resourceTenantId: uuid): Promise<void> => {
        request.resourceOwnerUserId = resourceOwnerUserId;
        request.resourceTenantId = resourceTenantId;
        const permitted = await RoleBasedPermissionHandler.checkRoleSpecificPermissions(request);
        if (!permitted) {
            throw new ApiError(403, 'Permission denied.');
        }
    };

}

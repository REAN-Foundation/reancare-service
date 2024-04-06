
import express from "express"
import { uuid } from "../domain.types/miscellaneous/system.types";
import { ApiError } from "../common/api.error";
import { PermissionHandler } from "../auth/custom/permission.handler";

///////////////////////////////////////////////////////////////////////////////////////

export class BaseController {

    //#region member variables and constructors

    constructor() {
    }
    
    //#endregion


    public authorizeOne = async (
        request: express.Request, 
        resourceOwnerUserId: uuid, 
        resourceTenantId: uuid): Promise<void> => {
        request.resourceOwnerUserId = resourceOwnerUserId;
        request.resourceTenantId = resourceTenantId;
        const permitted = await PermissionHandler.checkFineGrained(request);
        if (!permitted) {
            throw new ApiError(403, 'Permission denied.');
        }
    };

}

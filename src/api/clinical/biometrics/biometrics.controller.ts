import { BaseController } from "../../../api/base.controller";
import { ApiError } from "../../../common/api.error";
import express from 'express';
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { UserService } from '../../../services/users/user/user.service';
import { Injector } from "../../../startup/injector";
import { BiometricSearchFilters } from "../../../domain.types/clinical/biometrics/biometrics.types";
import { PermissionHandler } from "../../../auth/custom/permission.handler";

///////////////////////////////////////////////////////////////////////////////////////

export class BiometricsController extends BaseController {

    protected _userService: UserService = Injector.Container.resolve(UserService);

    constructor() {
        super();
    }

    authorizeUser = async (request: express.Request, ownerUserId: uuid) => {
        const user = await this._userService.getById(ownerUserId);
        if (!user) {
            throw new ApiError(404, `User with Id ${ownerUserId} not found.`);
        }
        request.resourceOwnerUserId = ownerUserId;
        request.resourceTenantId = user.TenantId;
        await this.authorizeOne(request, ownerUserId, user.TenantId);
    };

    authorizeSearch = async (
        request: express.Request,
        searchFilters: BiometricSearchFilters): Promise<BiometricSearchFilters> => {

        const currentUser = request.currentUser;

        if (searchFilters.PatientUserId != null) {
            if (searchFilters.PatientUserId !== request.currentUser.UserId) {
                const hasConsent = await PermissionHandler.checkConsent(
                    searchFilters.PatientUserId,
                    currentUser.UserId,
                    request.context
                );
                if (!hasConsent) {
                    throw new ApiError(403, `Unauthorized`);
                }
            }
        }
        else {
            searchFilters.PatientUserId = currentUser.UserId;
        }
        return searchFilters;
    };

}

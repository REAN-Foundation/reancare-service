import { BaseController } from "../../../api/base.controller";
import { ApiError } from "../../../common/api.error";
import express from 'express';
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { UserService } from '../../../services/users/user/user.service';
import { Injector } from "../../../startup/injector";

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

}

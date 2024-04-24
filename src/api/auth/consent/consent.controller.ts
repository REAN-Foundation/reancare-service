import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ConsentService } from '../../../services/auth/consent.service';
import { UserService } from '../../../services/users/user/user.service';
import { RoleService } from '../../../services/role/role.service';
import { ConsentValidator } from './consent.validator';
import { PersonService } from '../../../services/person/person.service';
import { TenantService } from '../../../services/tenant/tenant.service';
import { Injector } from '../../../startup/injector';
import { ConsentCreateModel, ConsentSearchFilters } from '../../../domain.types/auth/consent.types';
import { BaseController } from '../../../api/base.controller';
import { PermissionHandler } from '../../../auth/custom/permission.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class ConsentController extends BaseController {

    //#region member variables and constructors

    _service: ConsentService = Injector.Container.resolve(ConsentService);

    _roleService: RoleService = Injector.Container.resolve(RoleService);

    _userService: UserService = Injector.Container.resolve(UserService);

    _personService: PersonService = Injector.Container.resolve(PersonService);

    _tenantService: TenantService = Injector.Container.resolve(TenantService);

    _validator = new ConsentValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: ConsentCreateModel = await this._validator.create(request);
            await this.authorizeOne(request, model.OwnerUserId, model.TenantId);
            const record = await this._service.create(model);
            if (record == null) {
                throw new ApiError(400, 'Cannot start conversation!');
            }
            ResponseHandler.success(request, response, 'Consent created successfully!', 201, {
                Consent : record,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, ' Consent record not found.');
            }
            await this.authorizeOne(request, record.OwnerUserId, record.TenantId);
            ResponseHandler.success(request, response, 'Consent record retrieved successfully!', 200, {
                Consent : record,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters: ConsentSearchFilters = await this._validator.search(request);
            await this.authorizeSearch(request, filters);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} consent records retrieved successfully!`;
            ResponseHandler.success(request, response, message, 200, {
                Consents : searchResults });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Consent record not found.');
            }
            await this.authorizeOne(request, record.OwnerUserId, record.TenantId);
            const updated = await this._service.update(id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update consent record!');
            }
            ResponseHandler.success(request, response, 'Consent record updated successfully!', 200, {
                Consent : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Consent record not found.');
            }
            await this.authorizeOne(request, record.OwnerUserId, record.TenantId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Consent record cannot be deleted.');
            }
            ResponseHandler.success(request, response, 'Consent record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Authorization methods

    private authorizeSearch = async (request: express.Request, searchFilters: ConsentSearchFilters)
        : Promise<ConsentSearchFilters> => {

        const currentUser = request.currentUser;

        if (searchFilters.OwnerUserId != null) {
            if (searchFilters.OwnerUserId !== request.currentUser.UserId) {
                const hasConsent = await PermissionHandler.checkConsent(
                    searchFilters.OwnerUserId,
                    currentUser.UserId,
                    request.context
                );
                if (!hasConsent) {
                    throw new ApiError(403, `Unauthorized`);
                }
            }
        }
        else {
            searchFilters.OwnerUserId = currentUser.UserId;
        }
        return searchFilters;
    };

    //#endregion

}

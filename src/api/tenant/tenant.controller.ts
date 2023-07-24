import express from 'express';
import { TenantService } from '../../services/tenant/tenant.service';
import { ResponseHandler } from '../../common/response.handler';
import { Loader } from '../../startup/loader';
import { TenantValidator } from './tenant.validator';
import { ApiError } from '../../common/api.error';
import { BaseController } from '../base.controller';
import { uuid } from '../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantController extends BaseController{

    //#region member variables and constructors

    _service: TenantService = null;

    _validator: TenantValidator = new TenantValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(TenantService);
    }

    //#endregion

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Tenant.Create', request, response);
            const model = await this._validator.createOrUpdate(request, false);
            const tenant = await this._service.create(model);
            if (tenant == null) {
                throw new ApiError(400, 'Unable to create tenant.');
            }
            ResponseHandler.success(request, response, 'Tenant added successfully!', 201, {
                Tenant : tenant,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Tenant.GetById', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            ResponseHandler.success(request, response, 'Tenant retrieved successfully!', 200, {
                Tenant : tenant,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Tenant.Search', request, response);
            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0 ? 'No records found!' : `Total ${count} tenant records retrieved successfully!`;
            ResponseHandler.success(request, response, message, 200, {
                TenantRecords : searchResults,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Tenant.Update', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            const domainModel = await this._validator.createOrUpdate(request, true);
            const updatedTenant = await this._service.update(id, domainModel);
            if (tenant == null) {
                throw new ApiError(400, 'Unable to update tenant record!');
            }
            ResponseHandler.success(request, response, 'Tenant updated successfully!', 200, {
                Tenant : updatedTenant,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Tenant.Delete', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            const deleted = await this._service.delete(id);
            ResponseHandler.success(request, response, 'Tenant deleted successfully!', 200, {
                Deleted : deleted,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    addUserAsAdminToTenant = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Tenant.AddUserAsAdminToTenant', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            const user = await this._service.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            const added = await this._service.addUserAsAdminToTenant(id, userId);
            ResponseHandler.success(request, response, 'User added as admin to tenant successfully!', 200, {
                Added : added,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    removeUserAsAdminFromTenant = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Tenant.RemoveUserAsAdminFromTenant', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            const user = await this._service.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            const removed = await this._service.removeUserAsAdminFromTenant(id, userId);
            ResponseHandler.success(request, response, 'User removed as admin from tenant successfully!', 200, {
                Removed : removed,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    addUserAsModeratorToTenant = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Tenant.AddUserAsModeratorToTenant', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            const user = await this._service.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            const added = await this._service.addUserAsModeratorToTenant(id, userId);
            ResponseHandler.success(request, response, 'User added as moderator to tenant successfully!', 200, {
                Added : added,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    removeUserAsModeratorFromTenant = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Tenant.RemoveUserAsModeratorFromTenant', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            const user = await this._service.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            const removed = await this._service.removeUserAsModeratorFromTenant(id, userId);
            ResponseHandler.success(request, response, 'User removed as moderator from tenant successfully!', 200, {
                Removed : removed,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getTenantStats = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Tenant.GetTenantStats', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            const stats = await this._service.getTenantStats(id);
            ResponseHandler.success(request, response, 'Tenant stats retrieved successfully!', 200, {
                Stats : stats,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getTenantAdmins = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Tenant.GetTenantAdmins', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            const admins = await this._service.getTenantAdmins(id);
            ResponseHandler.success(request, response, 'Tenant admins retrieved successfully!', 200, {
                Admins : admins,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getTenantModerators = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Tenant.GetTenantModerators', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const tenant = await this._service.getById(id);
            if (tenant == null) {
                throw new ApiError(404, 'Tenant not found.');
            }
            const moderators = await this._service.getTenantModerators(id);
            ResponseHandler.success(request, response, 'Tenant moderators retrieved successfully!', 200, {
                Moderators : moderators,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}

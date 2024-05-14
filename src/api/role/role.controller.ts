import express from 'express';
import { RoleService } from '../../services/role/role.service';
import { ResponseHandler } from '../../common/handlers/response.handler';
import { Injector } from '../../startup/injector';
import { RoleValidator } from './role.validator';
import { ApiError } from '../../common/api.error';
import { RoleDomainModel } from '../../domain.types/role/role.domain.model';
import { BaseController } from '../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class RoleController extends BaseController {

    //#region member variables and constructors

    _service: RoleService = Injector.Container.resolve(RoleService);

    _validator: RoleValidator = new RoleValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, res: express.Response): Promise<void> => {
        try {
            const model: RoleDomainModel = await this._validator.create(request);
            await this.authorizeOne(request, null, model.TenantId);
            const role = await this._service.create(model);
            if (role == null) {
                throw new ApiError(400, 'Cannot create role!');
            }
            ResponseHandler.success(request, res, 'Role created successfully!', 201, {
                Role : role,
            });
        } catch (error) {
            ResponseHandler.handleError(request, res, error);
        }
    };

    getById = async (request: express.Request, res: express.Response): Promise<void> => {
        try {
            const roleId: number = await this._validator.getParamInt(request, 'id');
            const role = await this._service.getById(roleId);
            if (role == null) {
                throw new ApiError(404, 'Role not found.');
            }
            await this.authorizeOne(request, null, role.TenantId);
            ResponseHandler.success(request, res, 'Role retrieved successfully!', 200, {
                Role : role,
            });
        } catch (error) {
            ResponseHandler.handleError(request, res, error);
        }
    };

    search = async (request: express.Request, res: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.search(request);
            const roles = await this._service.search(filters);
            ResponseHandler.success(request, res, 'Roles retrieved successfully!', 200, {
                Roles : roles,
            });
        } catch (error) {
            ResponseHandler.handleError(request, res, error);
        }
    };

    update = async (request: express.Request, res: express.Response): Promise<void> => {
        try {
            const roleId: number = await this._validator.getParamInt(request, 'id');
            const roleDomainModel = await this._validator.update(request);
            const role = await this._service.getById(roleId);
            if (role == null) {
                throw new ApiError(404, 'Role not found.');
            }
            await this.authorizeOne(request, null, role.TenantId);
            if (role.IsDefaultRole) {
                throw new ApiError(400, 'Default role cannot be updated.');
            }
            const updatedRole = await this._service.update(roleId, roleDomainModel);
            if (updatedRole == null) {
                throw new ApiError(400, 'Unable to update role!');
            }
            ResponseHandler.success(request, res, 'Role updated successfully!', 200, {
                Role : updatedRole,
            });
        } catch (error) {
            ResponseHandler.handleError(request, res, error);
        }
    };

    delete = async (request: express.Request, res: express.Response): Promise<void> => {
        try {
            const roleId: number = await this._validator.getParamInt(request, 'id');
            const role = await this._service.getById(roleId);
            if (role == null) {
                throw new ApiError(404, 'Role not found.');
            }
            await this.authorizeOne(request, null, role.TenantId);
            if (role.IsDefaultRole) {
                throw new ApiError(400, 'Default role cannot be deleted.');
            }
            const success: boolean = await this._service.delete(roleId);
            if (!success) {
                throw new ApiError(400, 'Role cannot be deleted.');
            }
            ResponseHandler.success(request, res, 'Role deleted successfully!', 200, {
                success : success,
            });
        } catch (error) {
            ResponseHandler.handleError(request, res, error);
        }
    };

    //#endregion

}

import express from 'express';
import { RoleService } from '../../services/role/role.service';
import { ResponseHandler } from '../../common/handlers/response.handler';
import { Injector } from '../../startup/injector';
import { RoleValidator } from './role.validator';
import { ApiError } from '../../common/api.error';

///////////////////////////////////////////////////////////////////////////////////////

export class RoleController{

    //#region member variables and constructors

    _service: RoleService = null;

    _validator: RoleValidator = new RoleValidator();

    constructor() {
        this._service = Injector.Container.resolve(RoleService);
    }

    //#endregion

    //#region Action methods

    create = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const roleDomainModel = await this._validator.create(req);
            const role = await this._service.create(roleDomainModel);
            if (role == null) {
                throw new ApiError(400, 'Cannot create role!');
            }
            ResponseHandler.success(req, res, 'Role created successfully!', 201, {
                Role : role,
            });
        } catch (error) {
            ResponseHandler.handleError(req, res, error);
        }
    };

    getById = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const roleId: number = await this._validator.getParamInt(req, 'id');
            const role = await this._service.getById(roleId);
            if (role == null) {
                throw new ApiError(404, 'Role not found.');
            }
            ResponseHandler.success(req, res, 'Role retrieved successfully!', 200, {
                Role : role,
            });
        } catch (error) {
            ResponseHandler.handleError(req, res, error);
        }
    };

    search = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.search(req);
            const roles = await this._service.search(filters);
            ResponseHandler.success(req, res, 'Roles retrieved successfully!', 200, {
                Roles : roles,
            });
        } catch (error) {
            ResponseHandler.handleError(req, res, error);
        }
    };

    update = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const roleId: number = await this._validator.getParamInt(req, 'id');
            const roleDomainModel = await this._validator.update(req);
            const role = await this._service.getById(roleId);
            if (role == null) {
                throw new ApiError(404, 'Role not found.');
            }
            if (role.IsDefaultRole) {
                throw new ApiError(400, 'Default role cannot be updated.');
            }
            const updatedRole = await this._service.update(roleId, roleDomainModel);
            if (updatedRole == null) {
                throw new ApiError(400, 'Unable to update role!');
            }
            ResponseHandler.success(req, res, 'Role updated successfully!', 200, {
                Role : updatedRole,
            });
        } catch (error) {
            ResponseHandler.handleError(req, res, error);
        }
    };

    delete = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const roleId: number = await this._validator.getParamInt(req, 'id');
            const role = await this._service.getById(roleId);
            if (role == null) {
                throw new ApiError(404, 'Role not found.');
            }
            if (role.IsDefaultRole) {
                throw new ApiError(400, 'Default role cannot be deleted.');
            }
            const success: boolean = await this._service.delete(roleId);
            if (!success) {
                throw new ApiError(400, 'Role cannot be deleted.');
            }
            ResponseHandler.success(req, res, 'Role deleted successfully!', 200, {
                success : success,
            });
        } catch (error) {
            ResponseHandler.handleError(req, res, error);
        }
    };

    //#endregion

}

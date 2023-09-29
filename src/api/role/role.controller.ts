import express from 'express';
import { RoleService } from '../../services/role/role.service';
import { ResponseHandler } from '../../common/response.handler';
import { Loader } from '../../startup/loader';
import { RoleValidator } from './role.validator';
import { ApiError } from '../../common/api.error';
import { BaseController } from '../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class RoleController extends BaseController{

    //#region member variables and constructors

    _service: RoleService = null;

    _validator: RoleValidator = new RoleValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(RoleService);
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
            const role = await this._service.update(roleId, roleDomainModel);
            if (role == null) {
                throw new ApiError(400, 'Unable to update role!');
            }
            ResponseHandler.success(req, res, 'Role updated successfully!', 200, {
                Role : role,
            });
        } catch (error) {
            ResponseHandler.handleError(req, res, error);
        }
    };

    delete = async (req: express.Request, res: express.Response): Promise<void> => {
        try {
            const roleId: number = await this._validator.getParamInt(req, 'id');
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

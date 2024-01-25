import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { UserGroupService } from '../../../services/community/user.group.service';
import { UserService } from '../../../services/users/user/user.service';
import { RoleService } from '../../../services/role/role.service';
import { UserGroupValidator } from './user.group.validator';
import { PersonService } from '../../../services/person/person.service';
import { Injector } from '../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class UserGroupController {

    //#region member variables and constructors

    _service: UserGroupService = Injector.Container.resolve(UserGroupService);

    _roleService: RoleService = Injector.Container.resolve(RoleService);

    _userService: UserService = Injector.Container.resolve(UserService);

    _personService: PersonService = Injector.Container.resolve(PersonService);

    _validator = new UserGroupValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.create(request);
            const record = await this._service.create(model);
            if (record == null) {
                throw new ApiError(400, 'Cannot start conversation!');
            }
            ResponseHandler.success(request, response, 'Conversation started successfully!', 201, {
                UserGroup : record,
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
                throw new ApiError(404, ' User group record not found.');
            }
            ResponseHandler.success(request, response, 'User group record retrieved successfully!', 200, {
                UserGroup : record,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} medical condition records retrieved successfully!`;
            ResponseHandler.success(request, response, message, 200, {
                UserGroups : searchResults });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'User group record not found.');
            }
            const updated = await this._service.update(id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update medical condition record!');
            }
            ResponseHandler.success(request, response, 'User group record updated successfully!', 200, {
                UserGroup : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'User group record not found.');
            }
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'User group record cannot be deleted.');
            }
            ResponseHandler.success(request, response, 'User group record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getGroupUsers = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const group = await this._service.getById(id);
            if (group == null) {
                throw new ApiError(404, 'User group record not found.');
            }
            const users = await this._service.getGroupUsers(id);
            ResponseHandler.success(request, response, 'User group users retrieved successfully!', 200, {
                Users : users,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    addUserToGroup = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const groupId: uuid = await this._validator.getParamUuid(request, 'id');
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const group = await this._service.getById(groupId);
            if (group == null) {
                throw new ApiError(404, 'User group record not found.');
            }
            const user = await this._userService.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User record not found.');
            }
            const added = await this._service.addUserToGroup(userId, groupId);
            if (!added) {
                throw new ApiError(400, 'User cannot be added to group.');
            }
            ResponseHandler.success(request, response, 'User added to group successfully!', 200, {
                Added : true,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    removeUserFromGroup = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const groupId: uuid = await this._validator.getParamUuid(request, 'id');
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const group = await this._service.getById(groupId);
            if (group == null) {
                throw new ApiError(404, 'User group record not found.');
            }
            const user = await this._userService.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User record not found.');
            }
            const removed = await this._service.removeUserFromGroup(userId, groupId);
            if (!removed) {
                throw new ApiError(400, 'User cannot be removed from group.');
            }
            ResponseHandler.success(request, response, 'User removed from group successfully!', 200, {
                Removed : true,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    makeUserAdmin = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const groupId: uuid = await this._validator.getParamUuid(request, 'id');
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const group = await this._service.getById(groupId);
            if (group == null) {
                throw new ApiError(404, 'User group record not found.');
            }
            const user = await this._userService.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User record not found.');
            }
            const madeAdmin = await this._service.makeUserAdmin(userId, groupId);
            if (!madeAdmin) {
                throw new ApiError(400, 'User cannot be made admin of group.');
            }
            ResponseHandler.success(request, response, 'User made admin of group successfully!', 200, {
                MadeAdmin : true,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    removeUserAdmin = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const groupId: uuid = await this._validator.getParamUuid(request, 'id');
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const group = await this._service.getById(groupId);
            if (group == null) {
                throw new ApiError(404, 'User group record not found.');
            }
            const user = await this._userService.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User record not found.');
            }
            const removedAdmin = await this._service.removeUserAdmin(userId, groupId);
            if (!removedAdmin) {
                throw new ApiError(400, 'User cannot be removed as admin of group.');
            }
            ResponseHandler.success(request, response, 'User removed as admin of group successfully!', 200, {
                RemovedAdmin : true,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getGroupAdmins = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const groupId: uuid = await this._validator.getParamUuid(request, 'id');
            const group = await this._service.getById(groupId);
            if (group == null) {
                throw new ApiError(404, 'User group record not found.');
            }
            const admins = await this._service.getGroupAdmins(groupId);
            ResponseHandler.success(request, response, 'User group admins retrieved successfully!', 200, {
                Admins : admins,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    setGroupActivityTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const groupId: uuid = await this._validator.getParamUuid(request, 'id');
            const group = await this._service.getById(groupId);
            if (group == null) {
                throw new ApiError(404, 'User group record not found.');
            }
            const types = await this._validator.validateGroupActivityTypes(request);
            const set = await this._service.setGroupActivityTypes(groupId, types);
            if (!set) {
                throw new ApiError(400, 'Group activity types cannot be set.');
            }
            ResponseHandler.success(request, response, 'Group activity types set successfully!', 200, {
                Set : true,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getGroupActivityTypes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const groupId: uuid = await this._validator.getParamUuid(request, 'id');
            const group = await this._service.getById(groupId);
            if (group == null) {
                throw new ApiError(404, 'User group record not found.');
            }
            const types = await this._service.getGroupActivityTypes(groupId);
            ResponseHandler.success(request, response, 'Group activity types retrieved successfully!', 200, {
                Types : types,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

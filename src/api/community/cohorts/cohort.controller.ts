import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { CohortService } from '../../../services/community/cohort.service';
import { UserService } from '../../../services/users/user/user.service';
import { RoleService } from '../../../services/role/role.service';
import { CohortValidator } from './cohort.validator';
import { PersonService } from '../../../services/person/person.service';
import { Injector } from '../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class CohortController {

    //#region member variables and constructors

    _service: CohortService = Injector.Container.resolve(CohortService);

    _roleService: RoleService = Injector.Container.resolve(RoleService);

    _userService: UserService = Injector.Container.resolve(UserService);

    _personService: PersonService = Injector.Container.resolve(PersonService);

    _validator = new CohortValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.create(request);
            const record = await this._service.create(model);
            if (record == null) {
                throw new ApiError(400, 'Cannot start conversation!');
            }
            ResponseHandler.success(request, response, 'Cohort created successfully!', 201, {
                Cohort : record,
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
                throw new ApiError(404, ' Cohort record not found.');
            }
            ResponseHandler.success(request, response, 'Cohort record retrieved successfully!', 200, {
                Cohort : record,
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
                    : `Total ${count} cohort records retrieved successfully!`;
            ResponseHandler.success(request, response, message, 200, {
                Cohorts : searchResults });
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
                throw new ApiError(404, 'Cohort record not found.');
            }
            const updated = await this._service.update(id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update cohort record!');
            }
            ResponseHandler.success(request, response, 'Cohort record updated successfully!', 200, {
                Cohort : updated,
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
                throw new ApiError(404, 'Cohort record not found.');
            }
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Cohort record cannot be deleted.');
            }
            ResponseHandler.success(request, response, 'Cohort record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getCohortUsers = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const cohort = await this._service.getById(id);
            if (cohort == null) {
                throw new ApiError(404, 'Cohort record not found.');
            }
            const users = await this._service.getCohortUsers(id);
            ResponseHandler.success(request, response, 'Cohort users retrieved successfully!', 200, {
                Users : users,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    addUserToCohort = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const cohortId: uuid = await this._validator.getParamUuid(request, 'id');
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const cohort = await this._service.getById(cohortId);
            if (cohort == null) {
                throw new ApiError(404, 'Cohort record not found.');
            }
            const user = await this._userService.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User record not found.');
            }
            const added = await this._service.addUserToCohort(userId, cohortId);
            if (!added) {
                throw new ApiError(400, 'User cannot be added to cohort.');
            }
            ResponseHandler.success(request, response, 'User added to cohort successfully!', 200, {
                Added : true,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    removeUserFromCohort = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const cohortId: uuid = await this._validator.getParamUuid(request, 'id');
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const cohort = await this._service.getById(cohortId);
            if (cohort == null) {
                throw new ApiError(404, 'Cohort record not found.');
            }
            const user = await this._userService.getById(userId);
            if (user == null) {
                throw new ApiError(404, 'User record not found.');
            }
            const removed = await this._service.removeUserFromCohort(userId, cohortId);
            if (!removed) {
                throw new ApiError(400, 'User cannot be removed from cohort.');
            }
            ResponseHandler.success(request, response, 'User removed from cohort successfully!', 200, {
                Removed : true,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getCohortStats = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const cohort = await this._service.getById(id);
            if (cohort == null) {
                throw new ApiError(404, 'Cohort record not found.');
            }
            const stats = await this._service.getCohortStats(id);
            ResponseHandler.success(request, response, 'Cohort stats retrieved successfully!', 200, {
                Stats : stats,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getCohortsForTenant = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId: uuid = await this._validator.getParamUuid(request, 'tenantId');
            const cohorts = await this._service.getCohortsForTenant(tenantId);
            ResponseHandler.success(request, response, 'Cohorts retrieved successfully!', 200, {
                Cohorts : cohorts,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

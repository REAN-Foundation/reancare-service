import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { Injector } from '../../../../startup/injector';
import { UserService } from '../../../../services/users/user/user.service';
import { ActionPlanValidator } from './action.plan.validator';
import { ActionPlanService } from '../../../../services/users/patient/action.plan.service';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { GoalService } from '../../../../services/users/patient/goal.service';
import { HealthPriorityService } from '../../../../services/users/patient/health.priority.service';

///////////////////////////////////////////////////////////////////////////////////////

export class ActionPlanController {

    //#region member variables and constructors
    _service: ActionPlanService = null;

    _userService: UserService = null;

    _goalService: GoalService = null;

    _healthPriorityService: HealthPriorityService = null;

    _validator: ActionPlanValidator = new ActionPlanValidator();

    constructor() {
        this._service = Injector.Container.resolve(ActionPlanService);
        this._userService = Injector.Container.resolve(UserService);
        this._goalService = Injector.Container.resolve(GoalService);
        this._healthPriorityService = Injector.Container.resolve(HealthPriorityService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
            const actionPlan = await this._service.create(model);
            if (actionPlan == null) {
                throw new ApiError(400, 'Cannot create record for action plan!');
            }

            ResponseHandler.success(request, response, 'Action plan record created successfully!', 201, {
                ActionPlan : actionPlan,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getActionPlans = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const goalId: uuid = await this._validator.getParamUuid(request, 'goalId');

            const actionPlans = await this._service.getActionPlans(goalId);
            if (actionPlans == null) {
                throw new ApiError(400, 'Cannot fetch action plans for given patient!');
            }

            ResponseHandler.success(request, response, 'Fetching action plans for given patient done successfully!', 201, {
                ActionPlans : actionPlans,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getSelectedActionPlans = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const patientUserId: uuid = await this._validator.getParamUuid(request, 'patientUserId');

            const actionPlans = await this._service.getSelectedActionPlans(patientUserId);
            if (actionPlans == null) {
                throw new ApiError(400, 'Cannot fetch action plans for given patient!');
            }

            ResponseHandler.success(request, response, 'Fetching action plans for given patient done successfully!', 200, {
                ActionPlans : actionPlans,
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
                    : `Total ${count} action plan records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                ActionPlanRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Action plan record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);

            if (updated == null) {
                throw new ApiError(400, 'Unable to update action plan record!');
            }

            ResponseHandler.success(request, response, 'Action plan record updated successfully!', 200, {
                ActionPlan : updated,
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
                throw new ApiError(404, 'Action plan record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Action plan record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Action plan record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { BaseController } from '../base.controller';
import { UserService } from '../../../services/user/user.service';
import { ActionPlanValidator } from '../../validators/goal.action.plan/goal.action.plan.validator';
import { ActionPlanService } from '../../../services/goal.action.plan/goal.action.plan.service';

///////////////////////////////////////////////////////////////////////////////////////

export class ActionPlanController extends BaseController {

    //#region member variables and constructors
    _service: ActionPlanService = null;

    _userService: UserService = null;

    _validator: ActionPlanValidator = new ActionPlanValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(ActionPlanService);
        this._userService = Loader.container.resolve(UserService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('ActionPlan.Create', request, response);

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
            this.setContext('ActionPlan.getActionPlans', request, response);

            const model = await this._validator.getActionPlans(request);

            const actionPlans = await this._service.getActionPlans(model);
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
            this.setContext('ActionPlan.getSelectedActionPlans', request, response);

            const model = await this._validator.getSelectedActionPlans(request);

            const actionPlans = await this._service.getSelectedActionPlans(model);
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
    
    //#endregion

}

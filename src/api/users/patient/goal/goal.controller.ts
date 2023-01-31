import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { GoalService } from '../../../../services/users/patient/goal.service';
import { Loader } from '../../../../startup/loader';
import { GoalValidator } from './goal.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class GoalController extends BaseController {

    //#region member variables and constructors

    _service: GoalService = null;

    _validator: GoalValidator = new GoalValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(GoalService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Goal.Create', request, response);

            const model = await this._validator.create(request);
            const goal = await this._service.create(model);
            if (goal == null) {
                throw new ApiError(400, 'Cannot create record for patient goal!');
            }

            ResponseHandler.success(request, response, 'Patient goal record created successfully!', 201, {
                Goal : goal,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPatientGoals = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Goal.GetPatientGoals', request, response);

            const patientUserId: string = await this._validator.getParamUuid(request, 'patientUserId');
            const goals = await this._service.getPatientGoals(patientUserId);
            if (goals == null) {
                throw new ApiError(400, 'Cannot fetch goals for given patient!');
            }

            ResponseHandler.success(request, response, 'Fetching goals for given patient done successfully!', 200, {
                Goals : goals,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Goal.GetById', request, response);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const goal = await this._service.getById(id);
            if (goal == null) {
                throw new ApiError(404, 'Patient goal record not found.');
            }

            ResponseHandler.success(request, response, 'Patient goal record retrieved successfully!', 200, {
                Goal : goal,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Goal.Search', request, response);
            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} patient goal records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                GoalRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getGoalsByPriority = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Goal.GetGoalsByPriority', request, response);
            const priorityId: string = await this._validator.getParamUuid(request, 'priorityId');
            const patientGoals = await this._service.getGoalsByPriority(priorityId);
            if (patientGoals == null || patientGoals.length === 0) {
                throw new ApiError(404, 'patient goals not found.');
            }

            ResponseHandler.success(request, response, 'Patient goal retrieved successfully!', 200, {
                Goals : patientGoals,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Goal.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Patient goal record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update patient goal record!');
            }

            ResponseHandler.success(request, response, 'Patient goal record updated successfully!', 200, {
                Goal : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Goal.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Patient goal record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Patient goal record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Patient goal record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

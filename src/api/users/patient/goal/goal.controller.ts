import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { GoalService } from '../../../../services/users/patient/goal.service';
import { Injector } from '../../../../startup/injector';
import { GoalValidator } from './goal.validator';
import { PatientBaseController } from '../patient.base.controller';
import { GoalEvents } from './goal.event';

///////////////////////////////////////////////////////////////////////////////////////

export class GoalController extends PatientBaseController {

    //#region member variables and constructors

    _service: GoalService = Injector.Container.resolve(GoalService);

    _validator: GoalValidator = new GoalValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
            await this.authorizeOne(request, model.PatientUserId);
            const goal = await this._service.create(model);
            if (goal == null) {
                throw new ApiError(400, 'Cannot create record for patient goal!');
            }
            GoalEvents.onGoalStart(request, goal);
            ResponseHandler.success(request, response, 'Patient goal record created successfully!', 201, {
                Goal : goal,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPatientGoals = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const patientUserId: string = await this._validator.getParamUuid(request, 'patientUserId');
            await this.authorizeOne(request, patientUserId);
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
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const goal = await this._service.getById(id);
            if (goal == null) {
                throw new ApiError(404, 'Patient goal record not found.');
            }
            await this.authorizeOne(request, goal.PatientUserId);

            ResponseHandler.success(request, response, 'Patient goal record retrieved successfully!', 200, {
                Goal : goal,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            let filters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
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

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Patient goal record not found.');
            }
            await this.authorizeOne(request, record.PatientUserId);
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update patient goal record!');
            }
            GoalEvents.onGoalUpdate(request, updated);
            ResponseHandler.success(request, response, 'Patient goal record updated successfully!', 200, {
                Goal : updated,
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
                throw new ApiError(404, 'Patient goal record not found.');
            }
            await this.authorizeOne(request, record.PatientUserId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Patient goal record cannot be deleted.');
            }
            GoalEvents.onGoalCancel(request, record);
            ResponseHandler.success(request, response, 'Patient goal record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

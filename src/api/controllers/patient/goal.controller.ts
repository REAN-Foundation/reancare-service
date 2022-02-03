import express from 'express';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { GoalService } from '../../../services/patient/goal.service';
import { PatientService } from '../../../services/patient/patient.service';
import { Loader } from '../../../startup/loader';
import { GoalValidator } from '../../validators/patient/goal.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class GoalController {

    //#region member variables and constructors

    _service: GoalService = null;

    _authorizer: Authorizer = null;

    _patientService: PatientService = null;

    constructor() {
        this._service = Loader.container.resolve(GoalService);
        this._patientService = Loader.container.resolve(PatientService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Goal.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await GoalValidator.create(request);

            if (domainModel.PatientUserId != null) {
                const person = await this._patientService.getByUserId(domainModel.PatientUserId);
                if (person == null) {
                    throw new ApiError(404, `User with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

            const patientGoal = await this._service.create(domainModel);
            if (patientGoal == null) {
                throw new ApiError(400, 'Cannot create patientGoal!');
            }

            ResponseHandler.success(request, response, 'Goal created successfully!', 201, {
                Goal : patientGoal,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Goal.GetById';
            
            await this._authorizer.authorize(request, response);

            const id: string = await GoalValidator.getById(request);

            const patientGoal = await this._service.getById(id);
            if (patientGoal == null) {
                throw new ApiError(404, 'Goal not found.');
            }

            ResponseHandler.success(request, response, 'Goal retrieved successfully!', 200, {
                Goal : patientGoal,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Goal.Search';
            await this._authorizer.authorize(request, response);

            const filters = await GoalValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} patientGoal records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { Goals: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Goal.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await GoalValidator.update(request);

            const id: string = await GoalValidator.getById(request);
            const existingGoal = await this._service.getById(id);
            if (existingGoal == null) {
                throw new ApiError(404, 'Goal not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update patientGoal record!');
            }

            ResponseHandler.success(request, response, 'Goal record updated successfully!', 200, {
                Goal : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Goal.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await GoalValidator.getById(request);
            const existingGoal = await this._service.getById(id);
            if (existingGoal == null) {
                throw new ApiError(404, 'Goal not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Goal cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Goal record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

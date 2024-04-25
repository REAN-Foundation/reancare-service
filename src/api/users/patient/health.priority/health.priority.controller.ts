import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { Injector } from '../../../../startup/injector';
import { UserService } from '../../../../services/users/user/user.service';
import { HealthPriorityValidator } from './health.priority.validator';
import { HealthPriorityService } from '../../../../services/users/patient/health.priority.service';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { PatientBaseController } from '../patient.base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthPriorityController extends PatientBaseController {

    //#region member variables and constructors
    _service: HealthPriorityService = Injector.Container.resolve(HealthPriorityService);

    _userService: UserService = Injector.Container.resolve(UserService);

    _validator: HealthPriorityValidator = new HealthPriorityValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
            await this.authorizeOne(request, model.PatientUserId);
            const healthPriority = await this._service.create(model);
            if (healthPriority == null) {
                throw new ApiError(400, 'Cannot create record for health priority!');
            }

            ResponseHandler.success(request, response, 'health priority record created successfully!', 201, {
                HealthPriority : healthPriority,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPatientHealthPriorities = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const patientUserId: uuid = await this._validator.getParamUuid(request, 'patientUserId');
            await this.authorizeOne(request, patientUserId);
            const priorities = await this._service.getPatientHealthPriorities(patientUserId);
            if (priorities == null) {
                throw new ApiError(400, 'Cannot fetch priorities for given patient!');
            }

            ResponseHandler.success(request, response, 'Fetching priorities for given patient done successfully!', 200, {
                Priorities : priorities,
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
                    : `Total ${count} health priority records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                HealthPriorityRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Health priority record not found.');
            }
            await this.authorizeOne(request, record.PatientUserId);
            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update health priority record!');
            }

            ResponseHandler.success(request, response, 'Health priority record updated successfully!', 200, {
                HealthPriority : updated,
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
                throw new ApiError(404, 'Patient health priority record not found.');
            }
            await this.authorizeOne(request, record.PatientUserId);

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Patient health priority record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Patient health priority record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

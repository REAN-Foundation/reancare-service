import express from 'express';

import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { Authorizer } from '../../../auth/authorizer';
import { PersonService } from '../../../services/person.service';

import { ApiError } from '../../../common/api.error';
import { SleepValidator } from '../../validators/daily.records/sleep.validator';
import { SleepService } from '../../../services/daily.records/sleep.service';
import { RoleService } from '../../../services/role.service';
import { PatientService } from '../../../services/patient/patient.service';

///////////////////////////////////////////////////////////////////////////////////////

export class SleepController {

    //#region member variables and constructors

    _service: SleepService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _patientService: PatientService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(SleepService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._patientService = Loader.container.resolve(PatientService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DailyRecords.Sleep.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await SleepValidator.create(request);

            if (domainModel.PatientUserId != null) {
                var organization = await this._patientService.getByUserId(domainModel.PatientUserId);
                if (organization == null) {
                    throw new ApiError(404, `Patient with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

            const sleep = await this._service.create(domainModel);
            if (sleep == null) {
                throw new ApiError(400, 'Cannot create sleep!');
            }

            ResponseHandler.success(request, response, 'Daily sleep record created successfully!', 201, {
                SleepRecord : sleep,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DailyRecords.Sleep.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await SleepValidator.getById(request);

            const sleepRecord = await this._service.getById(id);
            if (sleepRecord == null) {
                throw new ApiError(404, 'Sleep record not found.');
            }

            ResponseHandler.success(request, response, 'Sleep record retrieved successfully!', 200, {
                SleepRecord : sleepRecord,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DailyRecords.Sleep.Search';
            await this._authorizer.authorize(request, response);

            const filters = await SleepValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} sleep records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { SleepRecords: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DailyRecords.Sleep.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await SleepValidator.update(request);

            const id: string = await SleepValidator.getById(request);
            const existingSleepRecord = await this._service.getById(id);
            if (existingSleepRecord == null) {
                throw new ApiError(404, 'Sleep record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update sleep record!');
            }

            ResponseHandler.success(request, response, 'Sleep record updated successfully!', 200, {
                SleepRecord : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DailyRecords.Sleep.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await SleepValidator.getById(request);
            const existingSleepRecord = await this._service.getById(id);
            if (existingSleepRecord == null) {
                throw new ApiError(404, 'Sleep record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Sleep record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Sleep record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

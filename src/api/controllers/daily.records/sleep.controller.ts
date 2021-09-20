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
            request.context = 'Sleep.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await SleepValidator.create(request);

            if (domainModel.PersonId != null) {
                const person = await this._personService.getById(domainModel.PersonId);
                if (person == null) {
                    throw new ApiError(404, `Person with an id ${domainModel.PersonId} cannot be found.`);
                }
            }

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

            ResponseHandler.success(request, response, 'Sleep created successfully!', 201, {
                Sleep : sleep,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Sleep.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await SleepValidator.getById(request);

            const sleep = await this._service.getById(id);
            if (sleep == null) {
                throw new ApiError(404, 'Sleep not found.');
            }

            ResponseHandler.success(request, response, 'Sleep retrieved successfully!', 200, {
                Sleep : sleep,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Sleep.Search';
            await this._authorizer.authorize(request, response);

            const filters = await SleepValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} sleep records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { Sleeps: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Sleep.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await SleepValidator.update(request);

            const id: string = await SleepValidator.getById(request);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'Sleep not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update sleep record!');
            }

            ResponseHandler.success(request, response, 'Sleep record updated successfully!', 200, {
                Sleep : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Sleep.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await SleepValidator.getById(request);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'Sleep not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Sleep cannot be deleted.');
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

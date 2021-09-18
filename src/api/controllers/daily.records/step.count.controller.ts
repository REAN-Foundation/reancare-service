import express from 'express';

import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { Authorizer } from '../../../auth/authorizer';
import { PersonService } from '../../../services/person.service';

import { ApiError } from '../../../common/api.error';
import { StepCountValidator } from '../../validators/daily.records/step.count.validator';
import { StepCountService } from '../../../services/daily.records/step.count.service';
import { RoleService } from '../../../services/role.service';
import { PatientService } from '../../../services/patient/patient.service';

///////////////////////////////////////////////////////////////////////////////////////

export class StepCountController {

    //#region member variables and constructors

    _service: StepCountService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _patientService: PatientService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(StepCountService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._patientService = Loader.container.resolve(PatientService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DailyRecords.StepCount.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await StepCountValidator.create(request);

            if (domainModel.PatientUserId != null) {
                var organization = await this._patientService.getByUserId(domainModel.PatientUserId);
                if (organization == null) {
                    throw new ApiError(404, `Patient with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

            const stepCount = await this._service.create(domainModel);
            if (stepCount == null) {
                throw new ApiError(400, 'Cannot create Step Count!');
            }

            ResponseHandler.success(request, response, 'Step count created successfully!', 201, {
                StepCount : stepCount,
                
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DailyRecords.StepCount.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await StepCountValidator.getById(request);

            const stepCount = await this._service.getById(id);
            if (stepCount == null) {
                throw new ApiError(404, 'Step Count not found.');
            }

            ResponseHandler.success(request, response, 'Step Count retrieved successfully!', 200, {
                StepCount : stepCount,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DailyRecords.StepCount.Search';
            await this._authorizer.authorize(request, response);

            const filters = await StepCountValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} Step Count records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { StepCountRecords: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DailyRecords.StepCount.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await StepCountValidator.update(request);

            const id: string = await StepCountValidator.getById(request);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'Step Count not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update Step ount record!');
            }

            ResponseHandler.success(request, response, 'Step Count record updated successfully!', 200, {
                StepCount : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'DailyRecords.StepCount.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await StepCountValidator.getById(request);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'Step Count not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Step Count cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Step Count record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

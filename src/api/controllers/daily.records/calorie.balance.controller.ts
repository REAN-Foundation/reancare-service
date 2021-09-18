import express from 'express';

import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { Authorizer } from '../../../auth/authorizer';
import { PersonService } from '../../../services/person.service';

import { ApiError } from '../../../common/api.error';
import { CalorieBalanceValidator } from '../../validators/daily.records/calorie.balance.validator';
import { CalorieBalanceService } from '../../../services/daily.records/calorie.balance.service';
import { RoleService } from '../../../services/role.service';
import { PatientService } from '../../../services/patient/patient.service';

///////////////////////////////////////////////////////////////////////////////////////

export class CalorieBalanceController {

    //#region member variables and constructors

    _service: CalorieBalanceService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _patientService: PatientService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(CalorieBalanceService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._patientService = Loader.container.resolve(PatientService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'CalorieBalance.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await CalorieBalanceValidator.create(request);

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

            const calorieBalance = await this._service.create(domainModel);
            if (calorieBalance == null) {
                throw new ApiError(400, 'Cannot create calorieBalance!');
            }

            ResponseHandler.success(request, response, 'CalorieBalance created successfully!', 201, {
                CalorieBalance : calorieBalance,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'CalorieBalance.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await CalorieBalanceValidator.getById(request);

            const calorieBalance = await this._service.getById(id);
            if (calorieBalance == null) {
                throw new ApiError(404, 'CalorieBalance not found.');
            }

            ResponseHandler.success(request, response, 'CalorieBalance retrieved successfully!', 200, {
                CalorieBalance : calorieBalance,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'CalorieBalance.Search';
            await this._authorizer.authorize(request, response);

            const filters = await CalorieBalanceValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} calorieBalance records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { CalorieBalances: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'CalorieBalance.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await CalorieBalanceValidator.update(request);

            const id: string = await CalorieBalanceValidator.getById(request);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'CalorieBalance not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update calorieBalance record!');
            }

            ResponseHandler.success(request, response, 'CalorieBalance record updated successfully!', 200, {
                CalorieBalance : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'CalorieBalance.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await CalorieBalanceValidator.getById(request);
            const existingAddress = await this._service.getById(id);
            if (existingAddress == null) {
                throw new ApiError(404, 'CalorieBalance not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'CalorieBalance cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'CalorieBalance record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

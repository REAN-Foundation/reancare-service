import express from 'express';

import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { Authorizer } from '../../../auth/authorizer';
import { PersonService } from '../../../services/person.service';

import { ApiError } from '../../../common/api.error';
import { PatientAllergyValidator } from '../../validators/patient/allergy.validator';
import { AllergyService } from '../../../services/patient/allergy.service';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientAllergyController {

    //#region member variables and constructors

    _service: AllergyService = null;

    _roleService: RoleService = null;

    _personService: PersonService = null;

    _userService: UserService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(AllergyService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._userService = Loader.container.resolve(UserService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientAllergy.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await PatientAllergyValidator.create(request);

            if (domainModel.PatientUserId != null) {
                const person = await this._userService.getById(domainModel.PatientUserId);
                if (person == null) {
                    throw new ApiError(404, `User with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

            const patientAllergy = await this._service.create(domainModel);
            if (patientAllergy == null) {
                throw new ApiError(400, 'Cannot create patientAllergy!');
            }

            ResponseHandler.success(request, response, 'PatientAllergy created successfully!', 201, {
                PatientAllergy : patientAllergy,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientAllergy.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await PatientAllergyValidator.getById(request);

            const patientAllergy = await this._service.getById(id);
            if (patientAllergy == null) {
                throw new ApiError(404, 'PatientAllergy not found.');
            }

            ResponseHandler.success(request, response, 'PatientAllergy retrieved successfully!', 200, {
                PatientAllergy : patientAllergy,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientAllergy.Search';
            await this._authorizer.authorize(request, response);

            const id = await PatientAllergyValidator.search(request);

            const searchResults = await this._service.search(id);

            const count = searchResults.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} patientAllergy records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { PatientAllergys: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientAllergy.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await PatientAllergyValidator.update(request);

            const id: string = await PatientAllergyValidator.getById(request);
            const existingAllergy = await this._service.getById(id);
            if (existingAllergy == null) {
                throw new ApiError(404, 'PatientAllergy not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update patientAllergy record!');
            }

            ResponseHandler.success(request, response, 'PatientAllergy record updated successfully!', 200, {
                PatientAllergy : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'PatientAllergy.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await PatientAllergyValidator.getById(request);
            const existingAllergy = await this._service.getById(id);
            if (existingAllergy == null) {
                throw new ApiError(404, 'PatientAllergy not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'PatientAllergy cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'PatientAllergy record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

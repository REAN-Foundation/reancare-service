import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { AllergySearchFilters } from '../../../domain.types/clinical/allergy/allergy.search.types';
import { AllergenCategoriesList, AllergenExposureRoutesList } from '../../../domain.types/clinical/allergy/allergy.types';
import { AllergyService } from '../../../services/clinical/allergy.service';
import { UserService } from '../../../services/users/user/user.service';
import { AllergyValidator } from './allergy.validator';
import { Injector } from '../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class AllergyController {

    //#region member variables and constructors

    _service: AllergyService = Injector.Container.resolve(AllergyService);

    _validator: AllergyValidator = new AllergyValidator();

    _userService: UserService = Injector.Container.resolve(UserService);

    //#endregion

    //#region Action methods

    getAllergenCategories = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            ResponseHandler.success(request, response, 'Allergen categories retrieved successfully!', 200, {
                AllergenCategories : AllergenCategoriesList,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAllergenExposureRoutes = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            ResponseHandler.success(request, response, 'Allergen exposure routes retrieved successfully!', 200, {
                AllergenExposureRoutes : AllergenExposureRoutesList,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.create(request);

            if (domainModel.PatientUserId != null) {
                const person = await this._userService.getById(domainModel.PatientUserId);
                if (person == null) {
                    throw new ApiError(404, `User with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

            const allergy = await this._service.create(domainModel);
            if (allergy == null) {
                throw new ApiError(400, 'Cannot create allergy!');
            }

            ResponseHandler.success(request, response, 'Allergy created successfully!', 201, {
                Allergy : allergy,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const allergy = await this._service.getById(id);
            if (allergy == null) {
                throw new ApiError(404, 'Allergy not found.');
            }

            ResponseHandler.success(request, response, 'Allergy retrieved successfully!', 200, {
                Allergy : allergy,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getForPatient = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const patientUserId = await this._validator.getParamUuid(request, 'patientUserId');

            const allergies = await this._service.getForPatient(patientUserId);

            ResponseHandler.success(request, response, 'Allergies for patient retrieved successfully!', 200, {
                Allergies : allergies
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const filters: AllergySearchFilters  = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} allergy records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { Allergies: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingAllergy = await this._service.getById(id);
            if (existingAllergy == null) {
                throw new ApiError(404, 'Allergy not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update allergy record!');
            }

            ResponseHandler.success(request, response, 'Allergy record updated successfully!', 200, {
                Allergy : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingAllergy = await this._service.getById(id);
            if (existingAllergy == null) {
                throw new ApiError(404, 'Allergy not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Allergy cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Allergy record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

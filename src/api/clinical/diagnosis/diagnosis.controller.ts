import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { DiagnosisService } from '../../../services/clinical/diagnosis.service';
import { UserService } from '../../../services/users/user/user.service';
import { Loader } from '../../../startup/loader';
import { DiagnosisValidator } from './diagnosis.validator';
import { BaseController } from '../../base.controller';
///////////////////////////////////////////////////////////////////////////////////////

export class DiagnosisController extends BaseController {

    //#region member variables and constructors

    _service: DiagnosisService = null;

    _validator: DiagnosisValidator = new DiagnosisValidator();

    _userService: UserService = null;

    constructor() {
        super();
        this._service = Loader.container.resolve(DiagnosisService);
        this._userService = Loader.container.resolve(UserService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Diagnosis.Create', request, response);

            const domainModel = await this._validator.create(request);

            if (domainModel.PatientUserId != null) {
                const person = await this._userService.getById(domainModel.PatientUserId);
                if (person == null) {
                    throw new ApiError(404, `User with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

            const diagnosis = await this._service.create(domainModel);
            if (diagnosis == null) {
                throw new ApiError(400, 'Cannot create diagnosis!');
            }

            ResponseHandler.success(request, response, 'Diagnosis created successfully!', 201, {
                Diagnosis : diagnosis,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Diagnosis.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const diagnosis = await this._service.getById(id);
            if (diagnosis == null) {
                throw new ApiError(404, 'Diagnosis record not found.');
            }

            ResponseHandler.success(request, response, 'Diagnosis retrieved successfully!', 200, {
                Diagnosis : diagnosis,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Diagnosis.Search', request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0 ? 'No records found!' : `Total ${count} diagnosis records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Diagnosis : searchResults,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Diagnosis.Update', request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingUser = await this._service.getById(id);
            if (existingUser == null) {
                throw new ApiError(404, 'Diagnosis record not found.');
            }

            const updatedDiagnosis = await this._service.update(id, domainModel);
            if (updatedDiagnosis == null) {
                throw new ApiError(400, 'Unable to update diagnosis record!');
            }

            ResponseHandler.success(request, response, 'Diagnosis records updated successfully!', 200, {
                Diagnosis : updatedDiagnosis,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Diagnosis.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingUser = await this._service.getById(id);
            if (existingUser == null) {
                throw new ApiError(404, 'Diagnosis record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Diagnosis record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Diagnosis record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

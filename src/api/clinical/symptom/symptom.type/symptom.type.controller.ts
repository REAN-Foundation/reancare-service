import express from 'express';

import { ResponseHandler } from '../../../../common/response.handler';
import { Loader } from '../../../../startup/loader';
import { Authorizer } from '../../../../auth/authorizer';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { SymptomTypeValidator } from './symptom.type.validator';
import { SymptomTypeService } from '../../../../services/clinical/symptom/symptom.type.service';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomTypeController extends BaseController {

    //#region member variables and constructors

    _service: SymptomTypeService = null;

    _validator: SymptomTypeValidator = new SymptomTypeValidator();

    _authorizer: Authorizer = null;

    constructor() {
        super();
        this._service = Loader.container.resolve(SymptomTypeService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('SymptomType.Create', request, response);

            const domainModel = await this._validator.create(request);

            const symptomType = await this._service.create(domainModel);
            if (symptomType == null) {
                throw new ApiError(400, 'Cannot create symptom type!');
            }

            ResponseHandler.success(request, response, 'Symptom type created successfully!', 201, {
                SymptomType : symptomType,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('SymptomType.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const symptomType = await this._service.getById(id);
            if (symptomType == null) {
                throw new ApiError(404, 'Symptom type not found.');
            }

            ResponseHandler.success(request, response, 'Symptom type retrieved successfully!', 200, {
                SymptomType : symptomType,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('SymptomType.Search', request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} symptom type records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { SymptomTypes: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('SymptomType.Update', request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingSymptomType = await this._service.getById(id);
            if (existingSymptomType == null) {
                throw new ApiError(404, 'Symptom type not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update symptom type record!');
            }

            ResponseHandler.success(request, response, 'Symptom type record updated successfully!', 200, {
                SymptomType : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('SymptomType.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingSymptomType = await this._service.getById(id);
            if (existingSymptomType == null) {
                throw new ApiError(404, 'Symptom type not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Symptom type cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Symptom type record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

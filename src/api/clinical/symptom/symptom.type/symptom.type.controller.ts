import express from 'express';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { Injector } from '../../../../startup/injector';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { SymptomTypeValidator } from './symptom.type.validator';
import { SymptomTypeService } from '../../../../services/clinical/symptom/symptom.type.service';
import { BaseController } from '../../../../api/base.controller';
import { SymptomTypeSearchFilters } from '../../../../domain.types/clinical/symptom/symptom.type/symptom.type.search.types';
import { PermissionHandler } from '../../../../auth/custom/permission.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomTypeController extends BaseController {

    //#region member variables and constructors

    _service: SymptomTypeService = Injector.Container.resolve(SymptomTypeService);

    _validator: SymptomTypeValidator = new SymptomTypeValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorizeOne(request, null, null);
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
            const filters: SymptomTypeSearchFilters = await this._validator.search(request);
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
            await this.authorizeOne(request, null, null);
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
            await this.authorizeOne(request, null, null);
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

import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { BloodCholesterolService } from '../../../../services/clinical/biometrics/blood.cholesterol.service';
import { Loader } from '../../../../startup/loader';
import { BloodCholesterolValidator } from './blood.cholesterol.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodCholesterolController extends BaseController {

    //#region member variables and constructors

    _service: BloodCholesterolService = null;

    _validator: BloodCholesterolValidator = new BloodCholesterolValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(BloodCholesterolService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BloodCholesterol.Create', request, response);

            const model = await this._validator.create(request);
            const bloodCholesterol = await this._service.create(model);
            if (bloodCholesterol == null) {
                throw new ApiError(400, 'Cannot create record for blood cholesterol!');
            }
            ResponseHandler.success(request, response, 'Blood cholesterol record created successfully!', 201, {
                BloodCholesterol : bloodCholesterol,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BloodCholesterol.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const bloodCholesterol = await this._service.getById(id);
            if (bloodCholesterol == null) {
                throw new ApiError(404, 'Blood cholesterol record not found.');
            }

            ResponseHandler.success(request, response, 'Blood cholesterol record retrieved successfully!', 200, {
                BloodCholesterol : bloodCholesterol,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BloodCholesterol.Search', request, response);
            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} blood cholesterol records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                BloodCholesterolRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BloodCholesterol.Update', request, response);

            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood cholesterol record not found.');
            }

            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update blood cholesterol record!');
            }

            ResponseHandler.success(request, response, 'Blood cholesterol record updated successfully!', 200, {
                BloodCholesterol : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BloodCholesterol.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood cholesterol record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Blood cholesterol record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Blood cholesterol record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion
}

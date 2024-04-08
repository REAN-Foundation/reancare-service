import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { BloodCholesterolService } from '../../../../services/clinical/biometrics/blood.cholesterol.service';
import { Injector } from '../../../../startup/injector';
import { BloodCholesterolValidator } from './blood.cholesterol.validator';
import { BloodCholesterolDomainModel } from '../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.domain.model';
import { BiometricsController } from '../biometrics.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodCholesterolController extends BiometricsController {

    //#region member variables and constructors

    _service: BloodCholesterolService = Injector.Container.resolve(BloodCholesterolService);

    _validator: BloodCholesterolValidator = new BloodCholesterolValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: BloodCholesterolDomainModel = await this._validator.create(request);
            await this.authorizeUser(request, model.PatientUserId);
            const record = await this._service.create(model);
            if (record == null) {
                throw new ApiError(400, 'Cannot create record for blood cholesterol!');
            }
            ResponseHandler.success(request, response, 'Blood cholesterol record created successfully!', 201, {
                BloodCholesterol : record,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Blood cholesterol record not found.');
            }
            await this.authorizeUser(request, record.PatientUserId);
            ResponseHandler.success(request, response, 'Blood cholesterol record retrieved successfully!', 200, {
                BloodCholesterol : record,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            let filters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
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

            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Blood cholesterol record not found.');
            }
            await this.authorizeUser(request, record.PatientUserId);
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

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Blood cholesterol record not found.');
            }
            await this.authorizeUser(request, record.PatientUserId);
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

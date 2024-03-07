import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { WearableDeviceDetailsService } from '../../../services/webhook/wearable.device.details.service';
import { WearableDeviceDetailsValidator } from './wearable.device.details.validator';
import { PatientService } from '../../../services/users/patient/patient.service';
import { Injector } from '../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class WearableDeviceDetailsController {

    //#region member variables and constructors
    _service: WearableDeviceDetailsService = Injector.Container.resolve(WearableDeviceDetailsService);

    _patientService: PatientService = Injector.Container.resolve(PatientService);

    _validator: WearableDeviceDetailsValidator = new WearableDeviceDetailsValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.create(request);

            const wearableDeviceDetail = await this._service.create(model);
            if (wearableDeviceDetail == null) {
                throw new ApiError(400, 'Cannot create record for wearable device details!');
            }
            ResponseHandler.success(request, response, 'Wearable device details record created successfully!', 201, {
                WearableDeviceDetail : wearableDeviceDetail,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const wearableDeviceDetail = await this._service.getById(id);
            if (wearableDeviceDetail == null) {
                throw new ApiError(404, ' wearable device details record not found.');
            }

            ResponseHandler.success(request, response, 'Wearable device details record retrieved successfully!', 200, {
                WearableDeviceDetail : wearableDeviceDetail,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} wearable device detail records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                WearableDeviceDetailRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'wearable device details record not found.');
            }

            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update wearable device details record!');
            }
            ResponseHandler.success(request, response, 'Wearable device details record updated successfully!', 200, {
                WearableDeviceDetail : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: string = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Wearable device details record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Wearable device details record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Wearable device details record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPatientWearableDeviceDetails = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const patientUserId: string = await this._validator.getParamUuid(request, 'patientUserId');
            const patientRecord = await this._patientService.getByUserId(patientUserId);
            if (patientRecord == null) {
                throw new ApiError(404, 'Patient record not found.');
            }

            const availableDetails = await this._service.getAvailableDeviceList(patientUserId);
            if (!availableDetails) {
                throw new ApiError(400, 'Wearable device details record not found.');
            }

            ResponseHandler.success(request, response, 'Wearable device details record retrieved successfully!', 200, {
                WearableDeviceDetails : availableDetails,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

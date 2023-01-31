import express from 'express';
import { BloodGlucoseDomainModel } from '../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { BloodGlucoseService } from '../../../../services/clinical/biometrics/blood.glucose.service';
import { Loader } from '../../../../startup/loader';
import { BloodGlucoseValidator } from './blood.glucose.validator';
import { BaseController } from '../../../base.controller';
import { EHRAnalyticsHandler } from '../../../../custom/ehr.analytics/ehr.analytics.handler';
import { EHRRecordTypes } from '../../../../custom/ehr.analytics/ehr.record.types';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodGlucoseController extends BaseController {

    //#region member variables and constructors
    _service: BloodGlucoseService = null;

    _validator: BloodGlucoseValidator = new BloodGlucoseValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(BloodGlucoseService);

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Biometrics.BloodGlucose.Create', request, response);

            const model = await this._validator.create(request);

            const bloodGlucose = await this._service.create(model);
            if (bloodGlucose == null) {
                throw new ApiError(400, 'Cannot create record for blood glucose!');
            }
            this.addEHRRecord(model.PatientUserId, bloodGlucose.id, model);
            ResponseHandler.success(request, response, 'Blood glucose record created successfully!', 201, {
                BloodGlucose : bloodGlucose,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Biometrics.BloodGlucose.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const bloodGlucose = await this._service.getById(id);
            if (bloodGlucose == null) {
                throw new ApiError(404, ' Blood Glucose record not found.');
            }

            ResponseHandler.success(request, response, 'Blood Glucose record retrieved successfully!', 200, {
                BloodGlucose : bloodGlucose,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Biometrics.BloodGlucose.Search', request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} blood glucose records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                BloodGlucoseRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Biometrics.BloodGlucose.Update', request, response);

            const model = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood glucose record not found.');
            }

            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update blood glucose record!');
            }
            this.addEHRRecord(model.PatientUserId, id, model);
            ResponseHandler.success(request, response, 'Blood glucose record updated successfully!', 200, {
                BloodGlucose : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Biometrics.BloodGlucose.Delete', request, response);

            const id: string = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood glucose record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Blood glucose record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Blood glucose record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

    private addEHRRecord = (patientUserId: uuid, recordId: uuid, model: BloodGlucoseDomainModel) => {
        if (model.BloodGlucose) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId,
                recordId,
                EHRRecordTypes.BloodGlucose,
                model.BloodGlucose,
                model.Unit);
        }
    }

    //#endregion

}

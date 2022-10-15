import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { BloodCholesterolService } from '../../../../services/clinical/biometrics/blood.cholesterol.service';
import { Loader } from '../../../../startup/loader';
import { BloodCholesterolValidator } from './blood.cholesterol.validator';
import { BaseController } from '../../../base.controller';
import { EHRAnalyticsHandler } from '../../../../custom/ehr.analytics/ehr.analytics.handler';
import { BloodCholesterolDomainModel } from '../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.domain.model';
import { EHRRecordTypes } from '../../../../custom/ehr.analytics/ehr.record.types';

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
            this.addEHRRecord(model.PatientUserId, bloodCholesterol.id, model);
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
            this.addEHRRecord(model.PatientUserId, id, model);

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

    //#region Privates

    private addEHRRecord = (patientUserId: uuid, recordId: uuid, model: BloodCholesterolDomainModel) => {
        if (model.A1CLevel) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId, recordId, EHRRecordTypes.Cholesterol_A1CLevel, model.A1CLevel);
        }
        if (model.HDL) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId, recordId, EHRRecordTypes.Cholesterol_HDL, model.HDL, model.Unit);
        }
        if (model.LDL) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId, recordId, EHRRecordTypes.Cholesterol_LDL, model.LDL, model.Unit);
        }
        if (model.Ratio) {
            EHRAnalyticsHandler.addFloatRecord(patientUserId, recordId, EHRRecordTypes.Cholesterol_Ratio, model.Ratio);
        }
        if (model.TotalCholesterol) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId, recordId, EHRRecordTypes.Cholesterol_Total, model.TotalCholesterol, model.Unit);
        }
        if (model.TriglycerideLevel) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId, recordId, EHRRecordTypes.Cholesterol_TriglycerideLevel, model.TriglycerideLevel);
        }
    }

    //#endregion

}

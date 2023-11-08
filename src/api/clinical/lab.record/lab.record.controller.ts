import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { BaseController } from '../../base.controller';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { LabRecordService } from '../../../services/clinical/lab.record/lab.record.service';
import { LabRecordValidator } from './lab.record.validator';
import { EHRAnalyticsHandler } from '../../../modules/ehr.analytics/ehr.analytics.handler';
import { LabRecordDomainModel } from '../../../domain.types/clinical/lab.record/lab.record/lab.record.domain.model';
import { EHRRecordTypes } from '../../../modules/ehr.analytics/ehr.record.types';
import { PatientService } from '../../../services/users/patient/patient.service';
import { UserDeviceDetailsService } from '../../../services/users/user/user.device.details.service';
import { Logger } from '../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class LabRecordController extends BaseController {

    //#region member variables and constructors
    _service: LabRecordService = null;

    _patientService: PatientService = null;

    _validator: LabRecordValidator = new LabRecordValidator();

    _userDeviceDetailsService: UserDeviceDetailsService = null;

    constructor() {
        super();
        this._service = Loader.container.resolve(LabRecordService);
        this._patientService = Loader.container.resolve(PatientService);
        this._userDeviceDetailsService = Loader.container.resolve(UserDeviceDetailsService);

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('LabRecord.Create', request, response);

            const model = await this._validator.create(request);
            const labRecord = await this._service.create(model);
            if (labRecord == null) {
                throw new ApiError(400, 'Cannot create lab record!');
            }
            const userDetails = await this._patientService.getByUserId(labRecord.PatientUserId);
            if (userDetails.User.IsTestUser == false) {
                var userDevices = await this._userDeviceDetailsService.getByUserId(labRecord.PatientUserId);
                if (userDevices.length > 0) {
                    userDevices.forEach(userDevice => {
                        if (this.eligibleToAddInEhrRecords(userDevice.AppName)) {
                            this.addEHRRecord(model.PatientUserId, labRecord.id, model);
                        } else {
                            Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${labRecord.PatientUserId}`);
                        }
                    });
                }
            }

            ResponseHandler.success(request, response, `${labRecord.DisplayName} record created successfully!`, 201, {
                LabRecord : labRecord,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('LabRecord.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const labRecord = await this._service.getById(id);
            if (labRecord == null) {
                throw new ApiError(404, 'Lab record not found.');
            }
            ResponseHandler.success(request, response, `${labRecord.DisplayName} record retrieved successfully!`, 200, {
                LabRecord : labRecord,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('LabRecord.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} lab records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                LabRecordRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('LabRecord.Update', request, response);

            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Lab record not found.');
            }

            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update lab record!');
            }
            const userDetails = await this._patientService.getByUserId(updated.PatientUserId);
            if (userDetails.User.IsTestUser == false) {
                var userDevices = await this._userDeviceDetailsService.getByUserId(updated.PatientUserId);
                if (userDevices.length > 0) {
                    userDevices.forEach(userDevice => {
                        if (this.eligibleToAddInEhrRecords(userDevice.AppName)) {
                            this.addEHRRecord(model.PatientUserId, model.id, model);
                        } else {
                            Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${updated.PatientUserId}`);
                        }
                    });
                }
            }
            ResponseHandler.success(request, response, `${updated.DisplayName} record updated successfully!`, 200, {
                LabRecord : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('LabRecord.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, `${existingRecord.DisplayName} record not found.`);
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, `${existingRecord.DisplayName} record cannot be deleted.`);
            }

            ResponseHandler.success(request, response, `${existingRecord.DisplayName} record deleted successfully!`, 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

    private addEHRRecord = (patientUserId: uuid, recordId: uuid, model: LabRecordDomainModel) => {
        if (model) {
            EHRAnalyticsHandler.addIntegerRecord(
                patientUserId,
                recordId,
                EHRRecordTypes.LabRecord, model.PrimaryValue, model.Unit, model.DisplayName, model.DisplayName);
        }
    };

    private eligibleToAddInEhrRecords = (userAppRegistrations) => {

        const eligibleToAddInEhrRecords =
        userAppRegistrations.indexOf('Heart &amp; Stroke Helper™') >= 0 ||
        userAppRegistrations.indexOf('REAN HealthGuru') >= 0 ||
        userAppRegistrations.indexOf('HF Helper') >= 0;

        return eligibleToAddInEhrRecords;
    };

    //#endregion

}

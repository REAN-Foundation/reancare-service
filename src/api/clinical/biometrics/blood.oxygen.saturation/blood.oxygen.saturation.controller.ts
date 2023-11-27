import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { BloodOxygenSaturationService } from '../../../../services/clinical/biometrics/blood.oxygen.saturation.service';
import { Loader } from '../../../../startup/loader';
import { BloodOxygenSaturationValidator } from './blood.oxygen.saturation.validator';
import { BaseController } from '../../../base.controller';
import { EHRAnalyticsHandler } from '../../../../modules/ehr.analytics/ehr.analytics.handler';
import { HelperRepo } from '../../../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../../../common/time.helper';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { AwardsFactsService } from '../../../../modules/awards.facts/awards.facts.service';
import { Logger } from '../../../../common/logger';
import { EHRVitalService } from '../../../../modules/ehr.analytics/ehr.vital.service';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodOxygenSaturationController extends BaseController {

    //#region member variables and constructors

    _service: BloodOxygenSaturationService = null;

    _validator: BloodOxygenSaturationValidator = new BloodOxygenSaturationValidator();

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _ehrVitalService: EHRVitalService = new EHRVitalService();

    constructor() {
        super();
        this._service = Loader.container.resolve(BloodOxygenSaturationService);
        this._ehrVitalService = Loader.container.resolve(EHRVitalService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BloodOxygenSaturation.Create', request, response);

            const model = await this._validator.create(request);
            const bloodOxygenSaturation = await this._service.create(model);
            if (bloodOxygenSaturation == null) {
                throw new ApiError(400, 'Cannot create record for blood oxygen saturation!');
            }
            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(bloodOxygenSaturation.PatientUserId);
            if (eligibleAppNames.length > 0) {
                for await (var appName of eligibleAppNames) { 
                    this._service.addEHRRecord(model.PatientUserId, bloodOxygenSaturation.id, bloodOxygenSaturation.Provider, model, appName);
                }
            } else {
                Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${bloodOxygenSaturation.PatientUserId}`);
            }

            // Adding record to award service
            if (bloodOxygenSaturation.BloodOxygenSaturation) {
                var timestamp = bloodOxygenSaturation.RecordDate;
                if (!timestamp) {
                    timestamp = new Date();
                }
                const currentTimeZone = await HelperRepo.getPatientTimezone(bloodOxygenSaturation.PatientUserId);
                const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(bloodOxygenSaturation.PatientUserId);
                const tempDate = TimeHelper.addDuration(timestamp, offsetMinutes, DurationType.Minute);

                AwardsFactsService.addOrUpdateVitalFact({
                    PatientUserId : bloodOxygenSaturation.PatientUserId,
                    Facts         : {
                        VitalName         : "BloodOxygenSaturation",
                        VitalPrimaryValue : bloodOxygenSaturation.BloodOxygenSaturation,
                        Unit              : bloodOxygenSaturation.Unit,
                    },
                    RecordId       : bloodOxygenSaturation.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }
            ResponseHandler.success(request, response, 'Blood oxygen saturation record created successfully!', 201, {
                BloodOxygenSaturation : bloodOxygenSaturation,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BloodOxygenSaturation.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const bloodOxygenSaturation = await this._service.getById(id);
            if (bloodOxygenSaturation == null) {
                throw new ApiError(404, ' Blood oxygen saturation record not found.');
            }

            ResponseHandler.success(request, response, 'Blood oxygen saturation record retrieved successfully!', 200, {
                BloodOxygenSaturation : bloodOxygenSaturation,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BloodOxygenSaturation.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} blood oxygen saturation records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                BloodOxygenSaturationRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BloodOxygenSaturation.Update', request, response);

            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);

            if (existingRecord == null) {
                throw new ApiError(404, 'Blood oxygen saturation record not found.');
            }

            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update blood oxygen saturation record!');
            }

            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(updated.PatientUserId);
            if (eligibleAppNames.length > 0) {
                for await (var appName of eligibleAppNames) { 
                    this._service.addEHRRecord(model.PatientUserId, id, updated.Provider, model, appName);
                }
            } else {
                Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${updated.PatientUserId}`);
            }

            // Adding record to award service
            if (updated.BloodOxygenSaturation) {
                var timestamp = updated.RecordDate;
                if (!timestamp) {
                    timestamp = new Date();
                }
                const currentTimeZone = await HelperRepo.getPatientTimezone(updated.PatientUserId);
                const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(updated.PatientUserId);
                const tempDate = TimeHelper.addDuration(timestamp, offsetMinutes, DurationType.Minute);

                AwardsFactsService.addOrUpdateVitalFact({
                    PatientUserId : updated.PatientUserId,
                    Facts         : {
                        VitalName         : "BloodOxygenSaturation",
                        VitalPrimaryValue : updated.BloodOxygenSaturation,
                        Unit              : updated.Unit,
                    },
                    RecordId       : updated.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }
            ResponseHandler.success(request, response, 'Blood oxygen saturation record updated successfully!', 200, {
                BloodOxygenSaturation : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BloodOxygenSaturation.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood oxygen saturation record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Blood oxygen saturation record cannot be deleted.');
            }

            // delete ehr record
            this._ehrVitalService.deleteVitalEHRRecord(existingRecord.id);

            ResponseHandler.success(request, response, 'Blood oxygen saturation record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

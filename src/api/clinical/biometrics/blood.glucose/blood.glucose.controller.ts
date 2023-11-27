import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { BloodGlucoseService } from '../../../../services/clinical/biometrics/blood.glucose.service';
import { Loader } from '../../../../startup/loader';
import { BloodGlucoseValidator } from './blood.glucose.validator';
import { BaseController } from '../../../base.controller';
import { EHRAnalyticsHandler } from '../../../../modules/ehr.analytics/ehr.analytics.handler';
import { HelperRepo } from '../../../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../../../common/time.helper';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { AwardsFactsService } from '../../../../modules/awards.facts/awards.facts.service';
import { Logger } from '../../../../common/logger';
import { EHRVitalService } from '../../../../modules/ehr.analytics/ehr.vital.service';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodGlucoseController extends BaseController {

    //#region member variables and constructors
    _service: BloodGlucoseService = null;

    _validator: BloodGlucoseValidator = new BloodGlucoseValidator();

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _ehrVitalService: EHRVitalService = new EHRVitalService();

    constructor() {
        super();
        this._service = Loader.container.resolve(BloodGlucoseService);
        this._ehrVitalService = Loader.container.resolve(EHRVitalService);
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
            // get user details to add records in ehr database
            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(bloodGlucose.PatientUserId);
            if (eligibleAppNames.length > 0) {
                for await (var appName of eligibleAppNames) { 
                    this._service.addEHRRecord(model.PatientUserId, bloodGlucose.id, bloodGlucose.Provider, model, appName);
                }
            } else {
                Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${bloodGlucose.PatientUserId}`);
            }
            // Adding record to award service
            if (bloodGlucose.BloodGlucose) {
                var timestamp = bloodGlucose.RecordDate;
                if (!timestamp) {
                    timestamp = new Date();
                }
                const currentTimeZone = await HelperRepo.getPatientTimezone(bloodGlucose.PatientUserId);
                const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(bloodGlucose.PatientUserId);
                const tempDate = TimeHelper.addDuration(timestamp, offsetMinutes, DurationType.Minute);

                AwardsFactsService.addOrUpdateVitalFact({
                    PatientUserId : bloodGlucose.PatientUserId,
                    Facts         : {
                        VitalName         : "BloodGlucose",
                        VitalPrimaryValue : bloodGlucose.BloodGlucose,
                        Unit              : bloodGlucose.Unit,
                    },
                    RecordId       : bloodGlucose.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }
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
            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(updated.PatientUserId);
            if (eligibleAppNames.length > 0) {
                for await (var appName of eligibleAppNames) { 
                    this._service.addEHRRecord(model.PatientUserId, id, updated.Provider, model, appName);
                }
            } else {
                Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${updated.PatientUserId}`);
            }

            if (updated.BloodGlucose) {
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
                        VitalName    : "BloodGlucose",
                        BloodGlucose : updated.BloodGlucose,
                        Unit         : updated.Unit,
                    },
                    RecordId       : updated.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }
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

            // delete ehr record
            this._ehrVitalService.deleteVitalEHRRecord(existingRecord.id);

            ResponseHandler.success(request, response, 'Blood glucose record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates
}

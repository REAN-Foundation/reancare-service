import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { BodyTemperatureService } from '../../../../services/clinical/biometrics/body.temperature.service';
import { Loader } from '../../../../startup/loader';
import { BodyTemperatureValidator } from './body.temperature.validator';
import { BaseController } from '../../../base.controller';
import { EHRAnalyticsHandler } from '../../../../modules/ehr.analytics/ehr.analytics.handler';
import { HelperRepo } from '../../../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../../../common/time.helper';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { AwardsFactsService } from '../../../../modules/awards.facts/awards.facts.service';
import { Logger } from '../../../../common/logger';
import { EHRVitalService } from '../../../../modules/ehr.analytics/ehr.vital.service';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyTemperatureController extends BaseController {

    //#region member variables and constructors

    _service: BodyTemperatureService = null;

    _validator: BodyTemperatureValidator = new BodyTemperatureValidator();

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _ehrVitalService: EHRVitalService = new EHRVitalService();

    constructor() {
        super();
        this._service = Loader.container.resolve(BodyTemperatureService);
        this._ehrVitalService = Loader.container.resolve(EHRVitalService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BodyTemperature.Create', request, response);

            const model = await this._validator.create(request);
            const bodyTemperature = await this._service.create(model);
            if (bodyTemperature == null) {
                throw new ApiError(400, 'Cannot create record for body temperature!');
            }
            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(bodyTemperature.PatientUserId);
            if (eligibleAppNames.length > 0) {
                for await (var appName of eligibleAppNames) { 
                    this._service.addEHRRecord(model.PatientUserId, bodyTemperature.id, bodyTemperature.Provider, model, appName);
                }
            } else {
                Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${bodyTemperature.PatientUserId}`);
            }
            // Adding record to award service
            if (bodyTemperature.BodyTemperature) {
                var timestamp = bodyTemperature.RecordDate;
                if (!timestamp) {
                    timestamp = new Date();
                }
                const currentTimeZone = await HelperRepo.getPatientTimezone(bodyTemperature.PatientUserId);
                const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(bodyTemperature.PatientUserId);
                const tempDate = TimeHelper.addDuration(timestamp, offsetMinutes, DurationType.Minute);

                AwardsFactsService.addOrUpdateVitalFact({
                    PatientUserId : bodyTemperature.PatientUserId,
                    Facts         : {
                        VitalName         : "BodyTemperature",
                        VitalPrimaryValue : bodyTemperature.BodyTemperature,
                        Unit              : bodyTemperature.Unit,
                    },
                    RecordId       : bodyTemperature.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }
            ResponseHandler.success(request, response, 'Body temperature record created successfully!', 201, {
                BodyTemperature : bodyTemperature,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BodyTemperature.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const bodyTemperature = await this._service.getById(id);
            if (bodyTemperature == null) {
                throw new ApiError(404, 'Body temperature record not found.');
            }

            ResponseHandler.success(request, response, 'Body temperature record retrieved successfully!', 200, {
                BodyTemperature : bodyTemperature,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BodyTemperature.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} body temperature records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                BodyTemperatureRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BodyTemperature.Update', request, response);

            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Body temperature record not found.');
            }

            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update body temperature record!');
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
            if (updated.BodyTemperature) {
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
                        VitalName         : "BodyTemperature",
                        VitalPrimaryValue : updated.BodyTemperature,
                        Unit              : updated.Unit,
                    },
                    RecordId       : updated.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }
            ResponseHandler.success(request, response, 'Body temperature record updated successfully!', 200, {
                BodyTemperature : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BodyTemperature.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Body temperature record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Body temperature record cannot be deleted.');
            }

            // delete ehr record
            this._ehrVitalService.deleteVitalEHRRecord(existingRecord.id);

            ResponseHandler.success(request, response, 'Body temperature record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

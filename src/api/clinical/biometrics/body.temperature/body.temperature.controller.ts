import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { BodyTemperatureService } from '../../../../services/clinical/biometrics/body.temperature.service';
import { Injector } from '../../../../startup/injector';
import { BodyTemperatureValidator } from './body.temperature.validator';
import { HelperRepo } from '../../../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../../../common/time.helper';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { AwardsFactsService } from '../../../../modules/awards.facts/awards.facts.service';
import { EHRVitalService } from '../../../../modules/ehr.analytics/ehr.services/ehr.vital.service';
import { BiometricsController } from '../biometrics.controller';
import { BiometricsEvents } from '../biometrics.events';
import { ActivityTrackerHandler } from '../../../../services/users/patient/activity.tracker/activity.tracker.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyTemperatureController extends BiometricsController {

    //#region member variables and constructors

    _service: BodyTemperatureService = Injector.Container.resolve(BodyTemperatureService);

    _validator: BodyTemperatureValidator = new BodyTemperatureValidator();

    _ehrVitalService: EHRVitalService = Injector.Container.resolve(EHRVitalService);

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
            await this.authorizeUser(request, model.PatientUserId);
            const bodyTemperature = await this._service.create(model);
            if (bodyTemperature == null) {
                throw new ApiError(400, 'Cannot create record for body temperature!');
            }
            await this._ehrVitalService.addEHRBodyTemperatureForAppNames(bodyTemperature);

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
                    RecordDateStr  : TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }

            BiometricsEvents.onBiometricsAdded(request, bodyTemperature, 'body.temperature');
            ActivityTrackerHandler.addOrUpdateActivity({
                PatientUserId      : model.PatientUserId,
                RecentActivityDate : new Date(),
            });
            ResponseHandler.success(request, response, 'Body temperature record created successfully!', 201, {
                BodyTemperature : bodyTemperature,
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
                throw new ApiError(404, 'Body temperature record not found.');
            }
            await this.authorizeUser(request, record.PatientUserId);

            ResponseHandler.success(request, response, 'Body temperature record retrieved successfully!', 200, {
                BodyTemperature : record,
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
                    : `Total ${count} body temperature records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                BodyTemperatureRecords : searchResults });

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
                throw new ApiError(404, 'Body temperature record not found.');
            }
            await this.authorizeUser(request, record.PatientUserId);
            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update body temperature record!');
            }
            await this._ehrVitalService.addEHRBodyTemperatureForAppNames(updated);

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
                    RecordDateStr  : TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }

            BiometricsEvents.onBiometricsUpdated(request, updated, 'body.temperature');
            ActivityTrackerHandler.addOrUpdateActivity({
                PatientUserId      : model.PatientUserId,
                RecentActivityDate : new Date(),
            });
            ResponseHandler.success(request, response, 'Body temperature record updated successfully!', 200, {
                BodyTemperature : updated,
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
                throw new ApiError(404, 'Body temperature record not found.');
            }
            await this.authorizeUser(request, record.PatientUserId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Body temperature record cannot be deleted.');
            }

            // delete ehr record
            this._ehrVitalService.deleteRecord(record.id);

            BiometricsEvents.onBiometricsDeleted(request, record, 'body.temperature');
            ResponseHandler.success(request, response, 'Body temperature record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

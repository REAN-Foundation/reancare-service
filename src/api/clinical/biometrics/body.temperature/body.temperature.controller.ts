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

///////////////////////////////////////////////////////////////////////////////////////

export class BodyTemperatureController {

    //#region member variables and constructors

    _service: BodyTemperatureService = Injector.Container.resolve(BodyTemperatureService);

    _validator: BodyTemperatureValidator = new BodyTemperatureValidator();

    _ehrVitalService: EHRVitalService = Injector.Container.resolve(EHRVitalService);

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
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
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Body temperature record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Body temperature record cannot be deleted.');
            }

            // delete ehr record
            this._ehrVitalService.deleteRecord(existingRecord.id);

            ResponseHandler.success(request, response, 'Body temperature record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

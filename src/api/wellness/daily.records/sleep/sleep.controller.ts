import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { SleepService } from '../../../../services/wellness/daily.records/sleep.service';
import { Injector } from '../../../../startup/injector';
import { SleepValidator } from './sleep.validator';
import { HelperRepo } from '../../../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../../../common/time.helper';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { AwardsFactsService } from '../../../../modules/awards.facts/awards.facts.service';
import { EHRMentalWellBeingService } from '../../../../modules/ehr.analytics/ehr.services/ehr.mental.wellbeing.service';
import { SleepDto } from '../../../../domain.types/wellness/daily.records/sleep/sleep.dto';

///////////////////////////////////////////////////////////////////////////////////////

export class SleepController{

    //#region member variables and constructors

    _service: SleepService = Injector.Container.resolve(SleepService);

    _ehrMentalWellbeingService: EHRMentalWellBeingService = Injector.Container.resolve(EHRMentalWellBeingService);

    _validator: SleepValidator = new SleepValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
            const recordDate = request.body.RecordDate;
            const patientUserId = request.body.PatientUserId;

            var sleep: SleepDto = null;
            var existingRecord = await this._service.getByRecordDate(recordDate, patientUserId);
            if (existingRecord !== null) {
                sleep = await this._service.update(existingRecord.id, model);
            } else {
                sleep = await this._service.create(model);
            }
            if (sleep == null) {
                throw new ApiError(400, 'Cannot create record for sleep!');
            }

            await this._ehrMentalWellbeingService.addEHRSleepForAppNames(sleep);

            if (sleep.SleepDuration) {
                var timestamp = sleep.RecordDate;
                if (!timestamp) {
                    timestamp = new Date();
                }
                const currentTimeZone = await HelperRepo.getPatientTimezone(sleep.PatientUserId);
                const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(sleep.PatientUserId);
                const tempDate = TimeHelper.addDuration(timestamp, offsetMinutes, DurationType.Minute);

                AwardsFactsService.addOrUpdateMentalHealthResponseFact({
                    PatientUserId : sleep.PatientUserId,
                    Facts         : {
                        Name     : 'Sleep',
                        Duration : sleep.SleepDuration,
                        Unit     : sleep.Unit,
                    },
                    RecordId       : sleep.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }

            ResponseHandler.success(request, response, 'Sleep record created successfully!', 201, {
                SleepRecord : sleep,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const sleepRecord = await this._service.getById(id);
            if (sleepRecord == null) {
                throw new ApiError(404, 'Sleep record not found.');
            }

            ResponseHandler.success(request, response, 'Sleep record retrieved successfully!', 200, {
                SleepRecord : sleepRecord,
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
                    : `Total ${count} sleep records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { SleepRecords: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Sleep record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update sleep record!');
            }
            await this._ehrMentalWellbeingService.addEHRSleepForAppNames(updated);

            ResponseHandler.success(request, response, 'Sleep record updated successfully!', 200, {
                SleepRecord : updated,
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
                throw new ApiError(404, 'Sleep record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Sleep record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Sleep record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

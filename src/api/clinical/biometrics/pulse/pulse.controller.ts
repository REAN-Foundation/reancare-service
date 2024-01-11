import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { PulseService } from '../../../../services/clinical/biometrics/pulse.service';
import { PulseValidator } from './pulse.validator';
import { BaseController } from '../../../base.controller';
import { HelperRepo } from '../../../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../../../common/time.helper';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { AwardsFactsService } from '../../../../modules/awards.facts/awards.facts.service';
import { EHRVitalService } from '../../../../modules/ehr.analytics/ehr.services/ehr.vital.service';
import { Injector } from '../../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class PulseController extends BaseController{

    //#region member variables and constructors

    _service: PulseService = null;

    _validator: PulseValidator = new PulseValidator();

    _ehrVitalService: EHRVitalService = new EHRVitalService();

    constructor() {
        super();
        this._service = Injector.Container.resolve(PulseService);
        this._ehrVitalService = Injector.Container.resolve(EHRVitalService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.Pulse.Create', request, response);

            const model = await this._validator.create(request);
            const pulse = await this._service.create(model);
            if (pulse == null) {
                throw new ApiError(400, 'Cannot create record for pulse!');
            }
            await this._ehrVitalService.addEHRPulseForAppNames(pulse);

            // Adding record to award service
            if (pulse.Pulse) {
                var timestamp = pulse.RecordDate;
                if (!timestamp) {
                    timestamp = new Date();
                }
                const currentTimeZone = await HelperRepo.getPatientTimezone(pulse.PatientUserId);
                const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(pulse.PatientUserId);
                const tempDate = TimeHelper.addDuration(timestamp, offsetMinutes, DurationType.Minute);

                AwardsFactsService.addOrUpdateVitalFact({
                    PatientUserId : pulse.PatientUserId,
                    Facts         : {
                        VitalName         : "Pulse",
                        VitalPrimaryValue : pulse.Pulse,
                        Unit              : pulse.Unit,
                    },
                    RecordId       : pulse.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }
            ResponseHandler.success(request, response, 'Pulse rate record created successfully!', 201, {
                Pulse : pulse,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.Pulse.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const pulse = await this._service.getById(id);
            if (pulse == null) {
                throw new ApiError(404, 'Pulse record not found.');
            }

            ResponseHandler.success(request, response, 'Pulse rate record retrieved successfully!', 200, {
                Pulse : pulse,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.Pulse.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} pulse rate records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                PulseRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.Pulse.Update', request, response);

            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Pulse record not found.');
            }

            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update pulse record!');
            }
            await this._ehrVitalService.addEHRPulseForAppNames(updated);

            if (updated.Pulse) {
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
                        VitalName         : "Pulse",
                        VitalPrimaryValue : updated.Pulse,
                        Unit              : updated.Unit,
                    },
                    RecordId       : updated.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }
            ResponseHandler.success(request, response, 'Pulse rate record updated successfully!', 200, {
                Pulse : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.Pulse.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Pulse record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Pulse record cannot be deleted.');
            }

            // delete ehr record
            this._ehrVitalService.deleteRecord(existingRecord.id);

            ResponseHandler.success(request, response, 'Pulse rate record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

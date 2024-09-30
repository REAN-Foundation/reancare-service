import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { BloodGlucoseService } from '../../../../services/clinical/biometrics/blood.glucose.service';
import { Injector } from '../../../../startup/injector';
import { BloodGlucoseValidator } from './blood.glucose.validator';
import { HelperRepo } from '../../../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../../../common/time.helper';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { AwardsFactsService } from '../../../../modules/awards.facts/awards.facts.service';
import { EHRVitalService } from '../../../../modules/ehr.analytics/ehr.services/ehr.vital.service';
import { BiometricsController } from '../biometrics.controller';
import { BiometricsEvents } from '../biometrics.events';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodGlucoseController extends BiometricsController {

    //#region member variables and constructors
    _service: BloodGlucoseService = Injector.Container.resolve(BloodGlucoseService);

    _validator: BloodGlucoseValidator = new BloodGlucoseValidator();

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
            const bloodGlucose = await this._service.create(model);
            if (bloodGlucose == null) {
                throw new ApiError(400, 'Cannot create record for blood glucose!');
            }

            await this._ehrVitalService.addEHRBloodGlucoseForAppNames(bloodGlucose);

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
                    RecordDateStr  : TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }
            BiometricsEvents.onBiometricsAdded(request, bloodGlucose, 'blood.glucose');
            ResponseHandler.success(request, response, 'Blood glucose record created successfully!', 201, {
                BloodGlucose : bloodGlucose,
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
                throw new ApiError(404, ' Blood Glucose record not found.');
            }
            await this.authorizeUser(request, record.PatientUserId);
            ResponseHandler.success(request, response, 'Blood Glucose record retrieved successfully!', 200, {
                BloodGlucose : record,
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
                    : `Total ${count} blood glucose records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                BloodGlucoseRecords : searchResults });

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
                throw new ApiError(404, 'Blood glucose record not found.');
            }
            await this.authorizeUser(request, record.PatientUserId);

            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update blood glucose record!');
            }
            await  this._ehrVitalService.addEHRBloodGlucoseForAppNames(updated);

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
                    RecordDateStr  : TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }
            BiometricsEvents.onBiometricsUpdated(request, updated, 'blood.glucose');
            ResponseHandler.success(request, response, 'Blood glucose record updated successfully!', 200, {
                BloodGlucose : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const id: string = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Blood glucose record not found.');
            }
            await this.authorizeUser(request, record.PatientUserId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Blood glucose record cannot be deleted.');
            }

            // delete ehr record
            this._ehrVitalService.deleteRecord(record.id);

            BiometricsEvents.onBiometricsDeleted(request, record, 'blood.glucose');
            ResponseHandler.success(request, response, 'Blood glucose record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

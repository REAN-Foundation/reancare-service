import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { BodyWeightService } from '../../../../services/clinical/biometrics/body.weight.service';
import { Injector } from '../../../../startup/injector';
import { BodyWeightValidator } from './body.weight.validator';
import { HelperRepo } from '../../../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../../../common/time.helper';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { AwardsFactsService } from '../../../../modules/awards.facts/awards.facts.service';
import { EHRVitalService } from '../../../../modules/ehr.analytics/ehr.services/ehr.vital.service';
import { BiometricsController } from '../biometrics.controller';
import { BiometricsEvents } from '../biometrics.events';
import { BodyHeightService } from '../../../../services/clinical/biometrics/body.height.service';
import { BodyHeightDto } from '../../../../domain.types/clinical/biometrics/body.height/body.height.dto';
import { Logger } from '../../../../common/logger';
import { BiometricAlerts } from '../biometrics.alert';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyWeightController extends BiometricsController {

    //#region member variables and constructors

    _service: BodyWeightService = Injector.Container.resolve(BodyWeightService);

    _heightService: BodyHeightService = Injector.Container.resolve(BodyHeightService);

    _validator: BodyWeightValidator = new BodyWeightValidator();

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
            const bodyWeight = await this._service.create(model);
            if (bodyWeight == null) {
                throw new ApiError(400, 'Cannot create weight record!');
            }
            await this._ehrVitalService.addEHRBodyWeightForAppNames(bodyWeight);

            // Adding record to award service
            if (bodyWeight.BodyWeight) {
                var timestamp = bodyWeight.RecordDate;
                if (!timestamp) {
                    timestamp = new Date();
                }
                const currentTimeZone = await HelperRepo.getPatientTimezone(bodyWeight.PatientUserId);
                const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(bodyWeight.PatientUserId);
                const tempDate = TimeHelper.addDuration(timestamp, offsetMinutes, DurationType.Minute);

                AwardsFactsService.addOrUpdateVitalFact({
                    PatientUserId : bodyWeight.PatientUserId,
                    Facts         : {
                        VitalName         : "BodyWeight",
                        VitalPrimaryValue : bodyWeight.BodyWeight,
                        Unit              : bodyWeight.Unit,
                    },
                    RecordId       : bodyWeight.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }

            const bodyHeight = await this.getBodyHeightByUserId(bodyWeight.PatientUserId);
            if (bodyHeight) {
                BiometricAlerts.forBodyBMI(bodyWeight, bodyHeight);
            }

            BiometricsEvents.onBiometricsAdded(request, bodyWeight, 'body.weight');
            ResponseHandler.success(request, response, 'Weight record created successfully!', 201, {
                BodyWeight : bodyWeight,
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
                throw new ApiError(404, 'Weight record not found.');
            }
            await this.authorizeUser(request, record.PatientUserId);
            ResponseHandler.success(request, response, 'Weight record retrieved successfully!', 200, {
                BodyWeight : record,
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
                    : `Total ${count} weight records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { BodyWeightRecords: searchResults });

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
                throw new ApiError(404, 'Weight record not found.');
            }
            await this.authorizeUser(request, record.PatientUserId);
            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update weight record!');
            }
            await this._ehrVitalService.addEHRBodyWeightForAppNames(updated);

            if (updated.BodyWeight) {
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
                        VitalName         : "BodyWeight",
                        VitalPrimaryValue : updated.BodyWeight,
                        Unit              : updated.Unit,
                    },
                    RecordId       : updated.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }

            BiometricsEvents.onBiometricsUpdated(request, updated, 'body.weight');
            ResponseHandler.success(request, response, 'Weight record updated successfully!', 200, {
                BodyWeight : updated,
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
                throw new ApiError(404, 'Weight record not found.');
            }
            await this.authorizeUser(request, record.PatientUserId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Weight record cannot be deleted.');
            }

            // delete ehr record
            this._ehrVitalService.deleteRecord(record.id);

            BiometricsEvents.onBiometricsDeleted(request, record, 'body.weight');
            ResponseHandler.success(request, response, 'Weight record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    private getBodyHeightByUserId = async (userId: uuid): Promise<BodyHeightDto> => {
        try {
            const bodyHeights = await this._heightService.search({
                PatientUserId : userId,
                Order         : 'descending',
                OrderBy       : 'CreatedAt',
            });

            if (bodyHeights.TotalCount === 0) {
                return null;
            }
            return bodyHeights.Items[0];

        } catch (error) {
            Logger.instance().log(`Error fetching body height by user id: ${error.message}`);
            return null;
        }
    };

}

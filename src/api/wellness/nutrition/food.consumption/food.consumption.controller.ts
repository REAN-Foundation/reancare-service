import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { FoodConsumptionService } from '../../../../services/wellness/nutrition/food.consumption.service';
import { Loader } from '../../../../startup/loader';
import { FoodConsumptionValidator } from './food.consumption.validator';
import { BaseController } from '../../../base.controller';
import { EHRAnalyticsHandler } from '../../../../modules/ehr.analytics/ehr.analytics.handler';
import { AwardsFactsService } from '../../../../modules/awards.facts/awards.facts.service';
import { HelperRepo } from '../../../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../../../common/time.helper';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { Logger } from '../../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class FoodConsumptionController extends BaseController {

    //#region member variables and constructors

    _service: FoodConsumptionService = null;

    _validator: FoodConsumptionValidator = new FoodConsumptionValidator();

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    constructor() {
        super();
        this._service = Loader.container.resolve(FoodConsumptionService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Nutrition.FoodConsumption.Create', request, response);

            const model = await this._validator.create(request);
            const foodConsumption = await this._service.create(model);
            if (foodConsumption == null) {
                throw new ApiError(400, 'Cannot create record for nutrition!');
            }

            // get user details to add records in ehr database
            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(foodConsumption.PatientUserId);
            if (eligibleAppNames.length > 0) {
                for await (var appName of eligibleAppNames) { 
                    this._service.addEHRRecord(model.PatientUserId, foodConsumption.id, foodConsumption.Provider, foodConsumption, appName);
                }
            } else {
                Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${foodConsumption.PatientUserId}`);
            }
            if (foodConsumption.UserResponse) {
                var timestamp = foodConsumption.EndTime ?? foodConsumption.StartTime;
                if (!timestamp) {
                    timestamp = new Date();
                }
                const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(foodConsumption.PatientUserId);
                const tempDate = TimeHelper.addDuration(timestamp, offsetMinutes, DurationType.Minute);
                const currentTimeZone = await HelperRepo.getPatientTimezone(foodConsumption.PatientUserId);

                AwardsFactsService.addOrUpdateNutritionResponseFact({
                    PatientUserId : foodConsumption.PatientUserId,
                    Facts         : {
                        UserResponse : foodConsumption.UserResponse,
                    },
                    RecordId       : foodConsumption.id,
                    RecordDate     : tempDate,
                    RecordDateStr  : await TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
                    RecordTimeZone : currentTimeZone,
                });
            }

            ResponseHandler.success(request, response, 'Nutrition record created successfully!', 201, {
                FoodConsumption : foodConsumption,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Nutrition.FoodConsumption.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const foodConsumption = await this._service.getById(id);
            if (foodConsumption == null) {
                throw new ApiError(404, 'Nutrition record not found.');
            }

            ResponseHandler.success(request, response, 'Nutrition record retrieved successfully!', 200, {
                FoodConsumption : foodConsumption,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByEvent = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Nutrition.FoodConsumption.GetByEvent', request, response);

            const consumedAs: string = await this._validator.getParamStr(request, 'consumedAs');
            const patientUserId: uuid = await this._validator.getParamUuid(request, 'patientUserId');
            const foodConsumptionEvent = await this._service.getByEvent(consumedAs, patientUserId);
            if (foodConsumptionEvent == null) {
                throw new ApiError(404, 'Nutrition record not found.');
            }

            ResponseHandler.success(request, response, 'Nutrition records retrieved successfully!', 200, {
                FoodConsumptionEvent : foodConsumptionEvent,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getForDay = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Nutrition.FoodConsumption.GetForDay', request, response);

            const date: Date = await this._validator.getParamDate(request, 'date');
            const patientUserId: uuid = await this._validator.getParamUuid(request, 'patientUserId');
            const foodConsumptionForDay = await this._service.getForDay(date, patientUserId);
            if (foodConsumptionForDay == null) {
                throw new ApiError(404, 'Nutrition record not found.');
            }

            ResponseHandler.success(request, response, 'Nutrition record retrieved successfully!', 200, {
                FoodConsumptionForDay : foodConsumptionForDay,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getNutritionQuestionnaire = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Nutrition.GetNutritionQuestionnaire', request, response, false);

            const questionnaire = await this._service.getNutritionQuestionnaire();
            if (questionnaire.length === 0) {
                throw new ApiError(400, 'Cannot fetch nutrition questionnaire!');
            }

            ResponseHandler.success(request, response, 'Fetched nutrition questionnaire successfully!', 201, {
                NutritionQuestionnaire : questionnaire,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Nutrition.FoodConsumption.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} nutrition records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                FoodConsumptionRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Nutrition.FoodConsumption.Update', request, response);

            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Nutrition record not found.');
            }
            const updated = await this._service.update(id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update nutrition record!');
                
            }
            if (updated.UserResponse !== null) {
                var timestamp = updated.CreatedAt ?? updated.EndTime ?? updated.StartTime;
                if (!timestamp) {
                    timestamp = new Date();
                }
                //const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(updated.PatientUserId);
                //const tempDate = TimeHelper.addDuration(timestamp, offsetMinutes, DurationType.Minute);
                
                AwardsFactsService.addOrUpdateNutritionResponseFact({
                    PatientUserId : updated.PatientUserId,
                    Facts         : {
                        UserResponse : updated.UserResponse,
                    },
                    RecordId      : updated.id,
                    RecordDate    : timestamp,
                    RecordDateStr : await TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp)
                });
            }
            ResponseHandler.success(request, response, 'Nutrition record updated successfully!', 200, {
                FoodConsumption : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Nutrition.FoodConsumption.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Nutrition record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Nutrition record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Nutrition record deleted successfully!', 200, {
                Deleted : true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { FoodConsumptionService } from '../../../../services/wellness/nutrition/food.consumption.service';
import { Injector } from '../../../../startup/injector';
import { FoodConsumptionValidator } from './food.consumption.validator';
import { AwardsFactsService } from '../../../../modules/awards.facts/awards.facts.service';
import { HelperRepo } from '../../../../database/sql/sequelize/repositories/common/helper.repo';
import { TimeHelper } from '../../../../common/time.helper';
import { DurationType } from '../../../../domain.types/miscellaneous/time.types';
import { EHRNutritionService } from '../../../../modules/ehr.analytics/ehr.services/ehr.nutrition.service';
import { FoodConsumptionSearchFilters } from '../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.search.types';
import { PermissionHandler } from '../../../../auth/custom/permission.handler';
import { BaseController } from '../../../../api/base.controller';
import { UserService } from '../../../../services/users/user/user.service';

///////////////////////////////////////////////////////////////////////////////////////

export class FoodConsumptionController extends BaseController {

    //#region member variables and constructors

    _validator: FoodConsumptionValidator = new FoodConsumptionValidator();

    _ehrNutritionService: EHRNutritionService = Injector.Container.resolve(EHRNutritionService);

    _service: FoodConsumptionService = Injector.Container.resolve(FoodConsumptionService);

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
            await this.authorizeUser(request, model.PatientUserId);
            const foodConsumption = await this._service.create(model);
            if (foodConsumption == null) {
                throw new ApiError(400, 'Cannot create record for nutrition!');
            }

            await this._ehrNutritionService.addEHRRecordNutritionForAppNames(foodConsumption);

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
                    RecordDateStr  : TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp),
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

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const foodConsumption = await this._service.getById(id);
            if (foodConsumption == null) {
                throw new ApiError(404, 'Nutrition record not found.');
            }
            await this.authorizeUser(request, foodConsumption.PatientUserId);
            ResponseHandler.success(request, response, 'Nutrition record retrieved successfully!', 200, {
                FoodConsumption : foodConsumption,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByEvent = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const consumedAs: string = await this._validator.getParamStr(request, 'consumedAs');
            const patientUserId: uuid = await this._validator.getParamUuid(request, 'patientUserId');
            await this.authorizeUser(request, patientUserId);
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

            const date: Date = await this._validator.getParamDate(request, 'date');
            const patientUserId: uuid = await this._validator.getParamUuid(request, 'patientUserId');
            await this.authorizeUser(request, patientUserId);
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

            let filters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
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

            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Nutrition record not found.');
            }
            await this.authorizeUser(request, existingRecord.PatientUserId);
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
                    RecordDateStr : TimeHelper.formatDateToLocal_YYYY_MM_DD(timestamp)
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

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Nutrition record not found.');
            }
            await this.authorizeUser(request, existingRecord.PatientUserId);
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
    private authorizeUser = async (request: express.Request, ownerUserId: uuid) => {
        const _userService = Injector.Container.resolve(UserService);
        const user = await _userService.getById(ownerUserId);
        if (!user) {
            throw new ApiError(404, `User with Id ${ownerUserId} not found.`);
        }
        request.resourceOwnerUserId = ownerUserId;
        request.resourceTenantId = user.TenantId;
        await this.authorizeOne(request, ownerUserId, user.TenantId);
    };

    authorizeSearch = async (
        request: express.Request,
        searchFilters: FoodConsumptionSearchFilters): Promise<FoodConsumptionSearchFilters> => {

        const currentUser = request.currentUser;

        if (searchFilters.PatientUserId != null) {
            if (searchFilters.PatientUserId !== request.currentUser.UserId) {
                const hasConsent = await PermissionHandler.checkConsent(
                    searchFilters.PatientUserId,
                    currentUser.UserId,
                    request.context
                );
                if (!hasConsent) {
                    throw new ApiError(403, `Unauthorized`);
                }
            }
        }
        else {
            searchFilters.PatientUserId = currentUser.UserId;
        }
        return searchFilters;
    };

}

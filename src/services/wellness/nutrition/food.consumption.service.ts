import { NutritionQuestionnaireDomainModel }
    from "../../../domain.types/wellness/nutrition/nutrition.questionnaire/nutrition.questionnaire.domain.model";
import { NutritionQuestionnaireDto }
    from "../../../domain.types/wellness/nutrition/nutrition.questionnaire/nutrition.questionnaire.dto";
import { inject, injectable } from "tsyringe";
import { IFoodConsumptionRepo } from "../../../database/repository.interfaces/wellness/nutrition/food.consumption.repo.interface";
import { FoodConsumptionDomainModel } from '../../../domain.types/wellness/nutrition/food.consumption/food.consumption.domain.model';
import { FoodConsumptionDto, FoodConsumptionEventDto, FoodConsumptionForDayDto } from '../../../domain.types/wellness/nutrition/food.consumption/food.consumption.dto';
import { FoodConsumptionSearchResults,
    FoodConsumptionSearchFilters
} from '../../../domain.types/wellness/nutrition/food.consumption/food.consumption.search.types';
import { EHRAnalyticsHandler } from "../../../modules/ehr.analytics/ehr.analytics.handler";
import { EHRRecordTypes } from "../../../modules/ehr.analytics/ehr.record.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class FoodConsumptionService {

    constructor(
        @inject('IFoodConsumptionRepo') private _foodConsumptionRepo: IFoodConsumptionRepo,
    ) { }

    create = async (foodConsumptionDomainModel: FoodConsumptionDomainModel):
        Promise<FoodConsumptionDto> => {
        return await this._foodConsumptionRepo.create(foodConsumptionDomainModel);
    };

    createNutritionQuestionnaire = async (nutritionQuestionnaireDomainModel: NutritionQuestionnaireDomainModel):
        Promise<NutritionQuestionnaireDto> => {
        return await this._foodConsumptionRepo.createNutritionQuestionnaire(nutritionQuestionnaireDomainModel);
    };

    getNutritionQuestionnaire = async (): Promise<NutritionQuestionnaireDto[]> => {
        return await this._foodConsumptionRepo.getNutritionQuestionnaire();
    };

    getById = async (id: string): Promise<FoodConsumptionDto> => {
        return await this._foodConsumptionRepo.getById(id);
    };

    getByEvent = async (event: string, patientUserId: string): Promise<FoodConsumptionEventDto> => {
        return await this._foodConsumptionRepo.getByEvent(event, patientUserId);
    };

    getForDay = async (date: Date, patientUserId: string): Promise<FoodConsumptionForDayDto> => {
        return await this._foodConsumptionRepo.getForDay(date, patientUserId);
    };

    search = async (filters: FoodConsumptionSearchFilters): Promise<FoodConsumptionSearchResults> => {
        return await this._foodConsumptionRepo.search(filters);
    };

    update = async (id: string, foodConsumptionDomainModel: FoodConsumptionDomainModel):
    Promise<FoodConsumptionDto> => {
        return await this._foodConsumptionRepo.update(id, foodConsumptionDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._foodConsumptionRepo.delete(id);
    };

    getAllUserResponsesBetween = async (patientUserId: string, dateFrom: Date, dateTo: Date)
        : Promise<any[]> => {
        return await this._foodConsumptionRepo.getAllUserResponsesBetween(patientUserId, dateFrom, dateTo);
    };

    getAllUserResponsesBefore = async (patientUserId: string, date: Date)
        : Promise<any[]> => {
        return await this._foodConsumptionRepo.getAllUserResponsesBefore(patientUserId, date);
    };

    public addEHRRecord = (patientUserId: uuid, recordId: uuid, provider: string, model: FoodConsumptionDto, appName?: string) => {
        if (model.FoodTypes[0] === "GenericNutrition") {
            EHRAnalyticsHandler.addBooleanRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.Nutrition,
                model.UserResponse,
                null,
                null,
                'Were most of your food choices healthy today?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
        if (model.FoodTypes[0] === "Fruit") {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.Nutrition,
                model.Servings,
                model.ServingUnit,
                'How many servings of fruit did you eat today?',
                'How many servings of fruit did you eat today?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
        if (model.FoodTypes[0] === "Vegetables") {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.Nutrition,
                model.Servings,
                model.ServingUnit,
                'How many servings of vegetables did you eat today?',
                'How many servings of vegetables did you eat today?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
        if (model.FoodTypes[0] === "Sugary drinks") {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.Nutrition,
                model.Servings,
                model.ServingUnit,
                'How many servings of sugary drinks did you drink today?',
                'How many servings of sugary drinks did you drink today?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
        if (model.FoodTypes[0] === "Salt") {
            EHRAnalyticsHandler.addBooleanRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.Nutrition,
                model.UserResponse,
                model.ServingUnit,
                'Did you choose or prepare foods with little or no salt today?',
                'Did you choose or prepare foods with little or no salt today?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null

            );
        }
        if (model.FoodTypes[0] === "Sea food") {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.Nutrition,
                model.Servings,
                model.ServingUnit,
                'How many servings of fish or shellfish/seafood did you eat today?',
                'How many servings of fish or shellfish/seafood did you eat today?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null

            );
        }
        if (model.FoodTypes[0] === "Grains") {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.Nutrition,
                model.Servings,
                model.ServingUnit,
                'How many servings of whole grains do you consume per day?',
                'How many servings of whole grains do you consume per day?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null

            );
        }
        if (model.FoodTypes[0] === "Protein") {
            EHRAnalyticsHandler.addBooleanRecord(
                patientUserId,
                recordId,
                provider,
                EHRRecordTypes.Nutrition,
                model.UserResponse,
                model.ServingUnit,
                'Did you select healthy sources of protein today?',
                'Did you select healthy sources of protein today?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null

            );
        }

    };

}

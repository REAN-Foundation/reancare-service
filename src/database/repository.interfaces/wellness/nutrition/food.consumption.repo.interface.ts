import { NutritionQuestionnaireDomainModel }
    from "../../../../domain.types/wellness/nutrition/nutrition.questionnaire/nutrition.questionnaire.domain.model";
import { NutritionQuestionnaireDto }
    from "../../../../domain.types/wellness/nutrition/nutrition.questionnaire/nutrition.questionnaire.dto";
import { FoodConsumptionDomainModel } from "../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.domain.model";
import { FoodConsumptionDto,
    FoodConsumptionEventDto,
    FoodConsumptionForDayDto
} from "../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.dto";
import { FoodConsumptionSearchFilters,
    FoodConsumptionSearchResults
} from "../../../../domain.types/wellness/nutrition/food.consumption/food.consumption.search.types";

export interface IFoodConsumptionRepo {

    create(foodConsumptionDomainModel: FoodConsumptionDomainModel): Promise<FoodConsumptionDto>;

    createNutritionQuestionnaire(model: NutritionQuestionnaireDomainModel): Promise<NutritionQuestionnaireDto>;

    getById(id: string): Promise<FoodConsumptionDto>;

    getNutritionQuestionnaire(): Promise<NutritionQuestionnaireDto[]>;

    getByEvent(event: string, patientUserId: string): Promise<FoodConsumptionEventDto>;

    getForDay(date: Date, patientUserId: string): Promise<FoodConsumptionForDayDto>;

    search(filters: FoodConsumptionSearchFilters): Promise<FoodConsumptionSearchResults>;

    update(id: string, foodConsumptionDomainModel: FoodConsumptionDomainModel):
    Promise<FoodConsumptionDto>;

    delete(id: string): Promise<boolean>;

    totalCount(): Promise<number>;

    getStats(patientUserId: string, numMonths: number): Promise<any>;

    getAllUserResponsesBetween(patientUserId: string, dateFrom: Date, dateTo: Date): Promise<any[]>;

    getAllUserResponsesBefore(patientUserId: string, date: Date): Promise<any[]>;

}

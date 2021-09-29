import { FoodConsumptionDomainModel } from "../../../domain.types/nutrition/food.consumption/food.consumption.domain.model";
import { FoodConsumptionDto, FoodConsumptionEventDto, FoodConsumptionForDayDto } from "../../../domain.types/nutrition/food.consumption/food.consumption.dto";
import { FoodConsumptionSearchFilters, FoodConsumptionSearchResults } from "../../../domain.types/nutrition/food.consumption/food.consumption.search.types";

export interface IFoodConsumptionRepo {

    create(foodConsumptionDomainModel: FoodConsumptionDomainModel): Promise<FoodConsumptionDto>;

    getById(id: string): Promise<FoodConsumptionDto>;

    getByEvent(event: string, patientUserId: string): Promise<FoodConsumptionEventDto>;

    getForDay(date: Date, patientUserId: string): Promise<FoodConsumptionForDayDto>;
    
    search(filters: FoodConsumptionSearchFilters): Promise<FoodConsumptionSearchResults>;

    update(id: string, foodConsumptionDomainModel: FoodConsumptionDomainModel):
    Promise<FoodConsumptionDto>;

    delete(id: string): Promise<boolean>;

}

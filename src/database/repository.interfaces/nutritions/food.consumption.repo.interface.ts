import { FoodConsumptionDomainModel } from "../../../domain.types/nutritions/food.consumption/food.consumption.domain.model";
import { FoodConsumptionDto, FoodConsumptionEventDto, FoodConsumptionForDayDto } from "../../../domain.types/nutritions/food.consumption/food.consumption.dto";
import { FoodConsumptionSearchFilters, FoodConsumptionSearchResults } from "../../../domain.types/nutritions/food.consumption/food.consumption.search.types";

export interface IFoodConsumptionRepo {

    create(foodConsumptionDomainModel: FoodConsumptionDomainModel): Promise<FoodConsumptionDto>;

    getById(id: string): Promise<FoodConsumptionDto>;

    getByEvent(event: string, patientUserId: string): Promise<FoodConsumptionEventDto>;

    getByDate(date: Date, patientUserId: string): Promise<FoodConsumptionForDayDto>;
    
    search(filters: FoodConsumptionSearchFilters): Promise<FoodConsumptionSearchResults>;

    update(id: string, foodConsumptionDomainModel: FoodConsumptionDomainModel):
    Promise<FoodConsumptionDto>;

    delete(id: string): Promise<boolean>;

}

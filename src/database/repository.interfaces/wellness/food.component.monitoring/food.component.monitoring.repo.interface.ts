import { FoodComponentMonitoringDomainModel } from "../../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.domain.model";
import { FoodComponentMonitoringDto } from "../../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.dto";
import {
    FoodComponentMonitoringSearchFilters,
    FoodComponentMonitoringSearchResults
} from "../../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.search.types";

export interface IFoodComponentMonitoringRepo {

    create(foodComponentMonitoringDomainModel: FoodComponentMonitoringDomainModel): Promise<FoodComponentMonitoringDto>;

    getById(id: string): Promise<FoodComponentMonitoringDto>;
    
    search(filters: FoodComponentMonitoringSearchFilters): Promise<FoodComponentMonitoringSearchResults>;

    update(id: string, foodComponentMonitoringDomainModel: FoodComponentMonitoringDomainModel):
    Promise<FoodComponentMonitoringDto>;

    delete(id: string): Promise<boolean>;

}

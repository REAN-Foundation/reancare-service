import { FoodComponentDomainModel } from "../../../../domain.types/wellness/food.component.monitoring/food.component.domain.model";
import { FoodComponentDto } from "../../../../domain.types/wellness/food.component.monitoring/food.component.dto";
import { FoodComponentSearchFilters, FoodComponentSearchResults } from "../../../../domain.types/wellness/food.component.monitoring/food.component.search.types";

export interface IFoodComponentRepo {

    create(foodComponentDomainModel: FoodComponentDomainModel): Promise<FoodComponentDto>;

    getById(id: string): Promise<FoodComponentDto>;
    
    search(filters: FoodComponentSearchFilters): Promise<FoodComponentSearchResults>;

    update(id: string, foodComponentDomainModel: FoodComponentDomainModel):
    Promise<FoodComponentDto>;

    delete(id: string): Promise<boolean>;

}

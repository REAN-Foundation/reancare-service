import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IFoodComponentRepo } from "../../../database/repository.interfaces/wellness/food.component.monitoring/food.component.repo.interface";
import { FoodComponentDomainModel } from '../../../domain.types/wellness/food.component.monitoring/food.component.domain.model';
import { FoodComponentDto } from '../../../domain.types/wellness/food.component.monitoring/food.component.dto';
import { FoodComponentSearchResults, FoodComponentSearchFilters } from '../../../domain.types/wellness/food.component.monitoring/food.component.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class FoodComponentService {

    constructor(
        @inject('IFoodComponentRepo') private _foodComponentRepo: IFoodComponentRepo,
    ) { }

    create = async (foodComponentDomainModel: FoodComponentDomainModel):
    Promise<FoodComponentDto> => {
        return await this._foodComponentRepo.create(foodComponentDomainModel);
    };

    getById = async (id: uuid): Promise<FoodComponentDto> => {
        return await this._foodComponentRepo.getById(id);
    };

    search = async (filters: FoodComponentSearchFilters): Promise<FoodComponentSearchResults> => {
        return await this._foodComponentRepo.search(filters);
    };

    update = async (id: uuid, foodComponentDomainModel: FoodComponentDomainModel):
    Promise<FoodComponentDto> => {
        return await this._foodComponentRepo.update(id, foodComponentDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._foodComponentRepo.delete(id);
    };

}

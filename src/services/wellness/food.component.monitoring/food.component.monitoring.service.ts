import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IFoodComponentMonitoringRepo } from "../../../database/repository.interfaces/wellness/food.component.monitoring/food.component.monitoring.repo.interface";
import { FoodComponentMonitoringDomainModel } from '../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.domain.model';
import { FoodComponentMonitoringDto } from '../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.dto';
import {
    FoodComponentMonitoringSearchResults,
    FoodComponentMonitoringSearchFilters
} from '../../../domain.types/wellness/food.component.monitoring/food.component.monitoring.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class FoodComponentMonitoringService {

    constructor(
        @inject('IFoodComponentMonitoringRepo') private _foodComponentMonitoringRepo: IFoodComponentMonitoringRepo,
    ) { }

    create = async (foodComponentMonitoringDomainModel: FoodComponentMonitoringDomainModel):
    Promise<FoodComponentMonitoringDto> => {
        return await this._foodComponentMonitoringRepo.create(foodComponentMonitoringDomainModel);
    };

    getById = async (id: uuid): Promise<FoodComponentMonitoringDto> => {
        return await this._foodComponentMonitoringRepo.getById(id);
    };

    search = async (filters: FoodComponentMonitoringSearchFilters): Promise<FoodComponentMonitoringSearchResults> => {
        return await this._foodComponentMonitoringRepo.search(filters);
    };

    update = async (id: uuid, foodComponentMonitoringDomainModel: FoodComponentMonitoringDomainModel):
    Promise<FoodComponentMonitoringDto> => {
        return await this._foodComponentMonitoringRepo.update(id, foodComponentMonitoringDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._foodComponentMonitoringRepo.delete(id);
    };

}

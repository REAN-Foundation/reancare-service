import { inject, injectable } from "tsyringe";
import { IFoodConsumptionRepo } from "../../database/repository.interfaces/nutrition/food.consumption.repo.interface";
import { FoodConsumptionDomainModel } from '../../domain.types/nutrition/food.consumption/food.consumption.domain.model';
import { FoodConsumptionDto, FoodConsumptionEventDto, FoodConsumptionForDayDto } from '../../domain.types/nutrition/food.consumption/food.consumption.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FoodConsumptionSearchResults, FoodConsumptionSearchFilters } from '../../domain.types/nutrition/food.consumption/food.consumption.search.types';

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

}

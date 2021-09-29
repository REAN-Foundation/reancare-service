import { inject, injectable } from "tsyringe";
import { IWaterConsumptionRepo } from "../../database/repository.interfaces/nutrition/water.consumption.repo.interface";
import { WaterConsumptionDomainModel } from '../../domain.types/nutrition/water.consumption/water.consumption.domain.model';
import { WaterConsumptionDto } from '../../domain.types/nutrition/water.consumption/water.consumption.dto';
import { WaterConsumptionSearchResults, WaterConsumptionSearchFilters } from '../../domain.types/nutrition/water.consumption/water.consumption.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class WaterConsumptionService {

    constructor(
        @inject('IWaterConsumptionRepo') private _waterConsumptionRepo: IWaterConsumptionRepo,
    ) { }

    create = async (waterConsumptionDomainModel: WaterConsumptionDomainModel):
    Promise<WaterConsumptionDto> => {
        return await this._waterConsumptionRepo.create(waterConsumptionDomainModel);
    };

    getById = async (id: string): Promise<WaterConsumptionDto> => {
        return await this._waterConsumptionRepo.getById(id);
    };

    search = async (filters: WaterConsumptionSearchFilters): Promise<WaterConsumptionSearchResults> => {
        return await this._waterConsumptionRepo.search(filters);
    };

    update = async (id: string, waterConsumptionDomainModel: WaterConsumptionDomainModel):
    Promise<WaterConsumptionDto> => {
        return await this._waterConsumptionRepo.update(id, waterConsumptionDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._waterConsumptionRepo.delete(id);
    };

}


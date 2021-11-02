import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IWaterConsumptionRepo } from "../../../database/repository.interfaces/wellness/nutrition/water.consumption.repo.interface";
import { WaterConsumptionDomainModel } from '../../../domain.types/wellness/nutrition/water.consumption/water.consumption.domain.model';
import { WaterConsumptionDto } from '../../../domain.types/wellness/nutrition/water.consumption/water.consumption.dto';
import { WaterConsumptionSearchResults, WaterConsumptionSearchFilters } from '../../../domain.types/wellness/nutrition/water.consumption/water.consumption.search.types';

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

    getById = async (id: uuid): Promise<WaterConsumptionDto> => {
        return await this._waterConsumptionRepo.getById(id);
    };

    search = async (filters: WaterConsumptionSearchFilters): Promise<WaterConsumptionSearchResults> => {
        return await this._waterConsumptionRepo.search(filters);
    };

    update = async (id: uuid, waterConsumptionDomainModel: WaterConsumptionDomainModel):
    Promise<WaterConsumptionDto> => {
        return await this._waterConsumptionRepo.update(id, waterConsumptionDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._waterConsumptionRepo.delete(id);
    };

}

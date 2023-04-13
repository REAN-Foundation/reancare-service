import { WaterConsumptionDomainModel } from "../../../../domain.types/wellness/nutrition/water.consumption/water.consumption.domain.model";
import { WaterConsumptionDto } from "../../../../domain.types/wellness/nutrition/water.consumption/water.consumption.dto";
import { WaterConsumptionSearchFilters, WaterConsumptionSearchResults } from "../../../../domain.types/wellness/nutrition/water.consumption/water.consumption.search.types";

export interface IWaterConsumptionRepo {

    create(waterConsumptionDomainModel: WaterConsumptionDomainModel): Promise<WaterConsumptionDto>;

    getById(id: string): Promise<WaterConsumptionDto>;
    
    search(filters: WaterConsumptionSearchFilters): Promise<WaterConsumptionSearchResults>;

    update(id: string, waterConsumptionDomainModel: WaterConsumptionDomainModel):
    Promise<WaterConsumptionDto>;

    delete(id: string): Promise<boolean>;

    getByRecordDate(recordDate: Date, patientUserId : string): Promise<WaterConsumptionDto>;

}

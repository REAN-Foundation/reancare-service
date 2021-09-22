import { BodyTemperatureDomainModel } from "../../../domain.types/biometrics/body.temperature/body.temperature.domain.model";
import { BodyTemperatureDto } from "../../../domain.types/biometrics/body.temperature/body.temperature.dto";
import { BodyTemperatureSearchFilters, BodyTemperatureSearchResults } from "../../../domain.types/biometrics/body.temperature/body.temperature.search.types";

export interface IBodyTemperatureRepo {

    create(bodyTemperatureDomainModel: BodyTemperatureDomainModel): Promise<BodyTemperatureDto>;

    getById(id: string): Promise<BodyTemperatureDto>;
    
    search(filters: BodyTemperatureSearchFilters): Promise<BodyTemperatureSearchResults>;

    update(id: string, bodyTemperatureDomainModel: BodyTemperatureDomainModel):
    Promise<BodyTemperatureDto>;

    delete(id: string): Promise<boolean>;

}

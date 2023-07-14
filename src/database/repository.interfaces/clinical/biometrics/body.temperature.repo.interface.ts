import { BodyTemperatureDomainModel } from "../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model";
import { BodyTemperatureDto } from "../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto";
import { BodyTemperatureSearchFilters, BodyTemperatureSearchResults } from "../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.search.types";

export interface IBodyTemperatureRepo {

    create(bodyTemperatureDomainModel: BodyTemperatureDomainModel): Promise<BodyTemperatureDto>;

    getById(id: string): Promise<BodyTemperatureDto>;
    
    search(filters: BodyTemperatureSearchFilters): Promise<BodyTemperatureSearchResults>;

    update(id: string, bodyTemperatureDomainModel: BodyTemperatureDomainModel):
    Promise<BodyTemperatureDto>;

    delete(id: string): Promise<boolean>;

    getAllUserResponsesBetween(patientUserId: string, dateFrom: Date, dateTo: Date): Promise<any[]>;

    getAllUserResponsesBefore(patientUserId: string, date: Date): Promise<any[]>;

    getRecent(patientUserId: string): Promise<BodyTemperatureDto>;

}

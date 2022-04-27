
import { BodyTemperatureDomainModel } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model';

////////////////////////////////////////////////////////////////////////////////////

export interface ITemperatureStore {
    add(temperatureDomainModel: BodyTemperatureDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: BodyTemperatureDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}

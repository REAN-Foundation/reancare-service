/* eslint-disable @typescript-eslint/no-unused-vars */
import { ITemperatureStore } from '../../interfaces/body.temperature.store.interface';
import { BodyTemperatureDomainModel } from '../../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model';
///////////////////////////////////////////////////////////////////

export class MockBodyTemperatureStore implements ITemperatureStore {

    add = async (model: BodyTemperatureDomainModel): Promise<any> => {
        return null;
    };

    getById = async (id: string): Promise<any> => {
        return null;
    };

    search = async (filter:any): Promise<any> => {
        return null;
    };

    update = async (id: string, updates: BodyTemperatureDomainModel): Promise<any> => {
        return null;
    };

    delete = async (id: string): Promise<any> => {
        return true;
    };

}

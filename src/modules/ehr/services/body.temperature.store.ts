import 'reflect-metadata';
import { ITemperatureStore } from '../interfaces/body.temperature.store.interface';
import { injectable, inject } from "tsyringe";
import { BodyTemperatureDomainModel } from '../../../domain.types/clinical/biometrics/body.temperature/body.temperature.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class TemperatureStore {

    constructor(@inject('ITemperatureStore') private _service: ITemperatureStore) {}

    add = async (model: BodyTemperatureDomainModel): Promise<any> => {
        return await this._service.add(model);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: BodyTemperatureDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}

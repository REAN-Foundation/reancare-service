import 'reflect-metadata';
import { IBloodPressureStore } from '../interfaces/blood.pressure.store.interface';
import { injectable, inject } from "tsyringe";
import { BloodPressureDomainModel } from '../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class BloodPressureStore {

    constructor(@inject('IBloodPressureStore') private _service: IBloodPressureStore) {}

    add = async (model: BloodPressureDomainModel): Promise<any> => {
        return await this._service.add(model);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: BloodPressureDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}

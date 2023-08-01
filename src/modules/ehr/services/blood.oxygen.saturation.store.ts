import 'reflect-metadata';
import { IBloodOxygenSaturationStore } from '../interfaces/blood.oxygen.saturation.store.interface';
import { injectable, inject } from "tsyringe";
import { BloodOxygenSaturationDomainModel } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class BloodOxygenSaturationStore {

    constructor(@inject('IBloodOxygenSaturationStore') private _service: IBloodOxygenSaturationStore) {}

    add = async (model: BloodOxygenSaturationDomainModel): Promise<any> => {
        return await this._service.add(model);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: BloodOxygenSaturationDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}

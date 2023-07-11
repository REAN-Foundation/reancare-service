import 'reflect-metadata';
import { IBloodGlucoseStore } from '../interfaces/blood.glucose.store.interface';
import { injectable, inject } from "tsyringe";
import { BloodGlucoseDomainModel }  from '../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class BloodGlucoseStore {

    constructor(@inject('IBloodGlucoseStore') private _service: IBloodGlucoseStore) {}

    add = async (model: BloodGlucoseDomainModel): Promise<any> => {
        return await this._service.add(model);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: BloodGlucoseDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}

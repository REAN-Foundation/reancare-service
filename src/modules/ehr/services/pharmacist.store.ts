import 'reflect-metadata';
import { IPharmacistStore } from '../interfaces/pharmacist.store.interface';
import { injectable, inject } from "tsyringe";
import { PharmacistDomainModel } from '../../../domain.types/users/pharmacist/pharmacist.domain.types';

///////////////////////////////////////////////////////////////////

@injectable()
export class PharmacistStore {

    constructor(@inject('IPharmacistStore') private _service: IPharmacistStore) {}

    add = async (model: PharmacistDomainModel): Promise<any> => {
        return await this._service.add(model);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: PharmacistDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}

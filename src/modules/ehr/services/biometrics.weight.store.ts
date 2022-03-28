import 'reflect-metadata';
import { IBiometricsWeightStore } from '../interfaces/biometrics.weight.store.interface';
import { injectable, inject } from "tsyringe";
import { BodyWeightDomainModel } from '../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class BiometricsWeightStore {

    constructor(@inject('IBiometricsWeightStore') private _service: IBiometricsWeightStore) {}

    add = async (model: BodyWeightDomainModel): Promise<any> => {
        return await this._service.add(model);
    }

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    }

    update = async (id: string, updates: BodyWeightDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    }

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    }

}

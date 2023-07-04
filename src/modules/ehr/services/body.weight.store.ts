import 'reflect-metadata';
import { IBodyWeightStore } from '../interfaces/body.weight.store.interface';
import { injectable, inject } from "tsyringe";
import { BodyWeightDomainModel } from '../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class BodyWeightStore {

    constructor(@inject('IBodyWeightStore') private _service: IBodyWeightStore) {}

    add = async (model: BodyWeightDomainModel): Promise<any> => {
        return await this._service.add(model);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: BodyWeightDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}

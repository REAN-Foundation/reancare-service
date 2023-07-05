import 'reflect-metadata';
import { IPulseStore } from '../interfaces/pulse.store.interface';
import { injectable, inject } from "tsyringe";
import { PulseDomainModel } from '../../../domain.types/clinical/biometrics/pulse/pulse.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class PulseStore {

    constructor(@inject('IPulseStore') private _service: IPulseStore) {}

    add = async (model: PulseDomainModel): Promise<any> => {
        return await this._service.add(model);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: PulseDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}

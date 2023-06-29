import 'reflect-metadata';
import { IFamilyHistoryStore } from '../interfaces/family.history.store.interface';
import { injectable, inject } from "tsyringe";
import { FamilyHistoryDomainModel } from '../../../domain.types/clinical/family.history/family.history.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class FamilyHistoryStore {

    constructor(@inject('IFamilyHistoryStore') private _service: IFamilyHistoryStore) {}

    create = async (model: FamilyHistoryDomainModel): Promise<any> => {
        return await this._service.create(model);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: FamilyHistoryDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}

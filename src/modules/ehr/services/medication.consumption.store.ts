import 'reflect-metadata';
import { IMedicationConsumptionStore } from '../interfaces/medication.consumption.store.interface';
import { injectable, inject } from "tsyringe";
import { MedicationConsumptionDomainModel } from '../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model';

///////////////////////////////////////////////////////////////////

@injectable()
export class MedicationConsumptionStore {

    constructor(@inject('IMedicationConsumptionStore') private _service: IMedicationConsumptionStore) {}

    add = async (model: MedicationConsumptionDomainModel): Promise<any> => {
        return await this._service.create(model);
    };

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    };

    update = async (id: string, updates: MedicationConsumptionDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    };

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    };

}

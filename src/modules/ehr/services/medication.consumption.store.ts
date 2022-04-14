import 'reflect-metadata';
import { IMedicationConsumptionStore } from '../interfaces/medication.consumption.store.interface';
import { injectable, inject } from "tsyringe";
import { MedicationConsumptionDomainModel } from '../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model';
import { MedicationConsumptionSearchFilters } from '../../../domain.types/clinical/medication/medication.consumption/medication.consumption.search.types';

///////////////////////////////////////////////////////////////////

@injectable()
export class MedicationConsumptionStore {

    constructor(@inject('IMedicationConsumptionStore') private _service: IMedicationConsumptionStore) {}

    add = async (model: MedicationConsumptionDomainModel): Promise<any> => {
        return await this._service.add(model);
    }

    search = async (filter: MedicationConsumptionSearchFilters): Promise<any> => {
        return await this._service.search(filter);
    }

    getById = async (id: string): Promise<any> => {
        return await this._service.getById(id);
    }

    update = async (id: string, updates: MedicationConsumptionDomainModel): Promise<any> => {
        return await this._service.update(id, updates);
    }

    delete = async (id: string): Promise<any> => {
        return await this._service.delete(id);
    }

}

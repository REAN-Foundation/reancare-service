import { MedicationConsumptionDomainModel } from '../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model';
import { MedicationConsumptionSearchFilters } from '../../../domain.types/clinical/medication/medication.consumption/medication.consumption.search.types';
////////////////////////////////////////////////////////////////////////////////////

export interface IMedicationConsumptionStore {
    add(medicationConsumptionDomainModel: MedicationConsumptionDomainModel): Promise<any>;
    search(filter: MedicationConsumptionSearchFilters): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: MedicationConsumptionDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}

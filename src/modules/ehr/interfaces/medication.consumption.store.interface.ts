import { MedicationConsumptionDomainModel } from '../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model';

////////////////////////////////////////////////////////////////////////////////////

export interface IMedicationConsumptionStore {
    create(medicationConsumptionDomainModel: MedicationConsumptionDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: MedicationConsumptionDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}

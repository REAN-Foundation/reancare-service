import { BloodPressureDomainModel } from '../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model';

////////////////////////////////////////////////////////////////////////////////////

export interface IBloodPressureStore {
    add(bloodPressureDomainModel: BloodPressureDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: BloodPressureDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}

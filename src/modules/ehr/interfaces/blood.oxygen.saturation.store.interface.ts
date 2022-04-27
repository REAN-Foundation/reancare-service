
import { BloodOxygenSaturationDomainModel } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model';

////////////////////////////////////////////////////////////////////////////////////

export interface IBloodOxygenSaturationStore {
    add(bloodOxygenSaturationDomainModel: BloodOxygenSaturationDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: BloodOxygenSaturationDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}


import { BloodOxygenSaturationDomainModel } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model';
import { BloodOxygenSaturationSearchFilters } from '../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.search.types';
////////////////////////////////////////////////////////////////////////////////////

export interface IBloodOxygenSaturationStore {
    // create(body: BloodOxygenSaturationDomainModel): any;
    add(bloodOxygenSaturationDomainModel: BloodOxygenSaturationDomainModel): Promise<any>;
    search(filter: BloodOxygenSaturationSearchFilters): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: BloodOxygenSaturationDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}

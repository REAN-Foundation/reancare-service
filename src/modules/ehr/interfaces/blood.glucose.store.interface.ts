import { BloodGlucoseDomainModel } from '../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model';

////////////////////////////////////////////////////////////////////////////////////

export interface IBloodGlucoseStore {
    add(bloodSugarDomainModel: BloodGlucoseDomainModel): Promise<any>;
    getById(id: string): Promise<any>;
    update(id: string, updates: BloodGlucoseDomainModel): Promise<any>;
    delete(id: string): Promise<any>;
}

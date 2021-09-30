import { BloodGlucoseDomainModel } from '../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model';
import { BloodGlucoseDto } from "../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto";
import { BloodGlucoseSearchFilters, BloodGlucoseSearchResults } from '../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.search.types';

export interface IBloodGlucoseRepo {

    create(bloodGlucoseDomainModel: BloodGlucoseDomainModel): Promise<BloodGlucoseDto>;

    getById(id: string): Promise<BloodGlucoseDto>;

    search(filters: BloodGlucoseSearchFilters): Promise<BloodGlucoseSearchResults>;

    update(id: string, bloodGlucoseDomainModel: BloodGlucoseDomainModel): Promise<BloodGlucoseDto>;

    delete(id: string): Promise<boolean>;

}

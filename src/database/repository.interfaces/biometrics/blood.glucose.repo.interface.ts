import { BloodGlucoseDto } from "../../../domain.types/biometrics/blood.glucose/blood.glucose.dto";
import { BloodGlucoseDomainModel } from '../../../domain.types/biometrics/blood.glucose/blood.glucose.domain.model';
import { BloodGlucoseSearchResults, BloodGlucoseSearchFilters } from '../../../domain.types/biometrics/blood.glucose/blood.glucose.search.types';

export interface IBloodGlucoseRepo {

    create(bloodGlucoseDomainModel: BloodGlucoseDomainModel): Promise<BloodGlucoseDto>;

    getById(id: string): Promise<BloodGlucoseDto>;

    search(filters: BloodGlucoseSearchFilters): Promise<BloodGlucoseSearchResults>;

    update(id: string, bloodGlucoseDomainModel: BloodGlucoseDomainModel): Promise<BloodGlucoseDto>;

    delete(id: string): Promise<boolean>;

}

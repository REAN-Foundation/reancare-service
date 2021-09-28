  
import { BloodPressureDomainModel } from "../../../domain.types/biometrics/blood.pressure/blood.pressure.domain.model";
import { BloodPressureDto } from "../../../domain.types/biometrics/blood.pressure/blood.pressure.dto";
import { BloodPressureSearchFilters, BloodPressureSearchResults } from "../../../domain.types/biometrics/blood.pressure/blood.pressure.search.types";

export interface IBloodPressureRepo {

    create(bloodPressureDomainModel: BloodPressureDomainModel): Promise<BloodPressureDto>;

    getById(id: string): Promise<BloodPressureDto>;
    
    search(filters: BloodPressureSearchFilters): Promise<BloodPressureSearchResults>;

    update(id: string, bloodPressureDomainModel: BloodPressureDomainModel):
    Promise<BloodPressureDto>;

    delete(id: string): Promise<boolean>;

}

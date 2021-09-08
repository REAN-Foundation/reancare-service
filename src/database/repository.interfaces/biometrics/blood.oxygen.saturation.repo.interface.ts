import { BloodOxygenSaturationDomainModel } from "../../../domain.types/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model";
import { BloodOxygenSaturationDto } from "../../../domain.types/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BloodOxygenSaturationSearchFilters, BloodOxygenSaturationSearchResults } from "../../../domain.types/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.search.types";

export interface IBloodOxygenSaturationRepo {

    create(bloodOxygenSaturationDomainModel: BloodOxygenSaturationDomainModel): Promise<BloodOxygenSaturationDto>;

    getById(id: string): Promise<BloodOxygenSaturationDto>;
    
    search(filters: BloodOxygenSaturationSearchFilters): Promise<BloodOxygenSaturationSearchResults>;

    update(id: string, bloodOxygenSaturationDomainModel: BloodOxygenSaturationDomainModel):
    Promise<BloodOxygenSaturationDto>;

    delete(id: string): Promise<boolean>;

}

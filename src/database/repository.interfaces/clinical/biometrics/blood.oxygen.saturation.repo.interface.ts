import { BloodOxygenSaturationDomainModel } from "../../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.domain.model";
import { BloodOxygenSaturationDto } from "../../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto";
import { BloodOxygenSaturationSearchFilters, BloodOxygenSaturationSearchResults } from "../../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.search.types";

export interface IBloodOxygenSaturationRepo {

    create(bloodOxygenSaturationDomainModel: BloodOxygenSaturationDomainModel): Promise<BloodOxygenSaturationDto>;

    getById(id: string): Promise<BloodOxygenSaturationDto>;
    
    search(filters: BloodOxygenSaturationSearchFilters): Promise<BloodOxygenSaturationSearchResults>;

    update(id: string, bloodOxygenSaturationDomainModel: BloodOxygenSaturationDomainModel):
    Promise<BloodOxygenSaturationDto>;

    delete(id: string): Promise<boolean>;

    getAllUserResponsesBetween(patientUserId: string, dateFrom: Date, dateTo: Date): Promise<any[]>;

    getAllUserResponsesBefore(patientUserId: string, date: Date): Promise<any[]>;

    getRecent(patientUserId: string): Promise<BloodOxygenSaturationDto>;

}

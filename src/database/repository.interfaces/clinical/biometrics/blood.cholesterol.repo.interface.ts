
import { BloodCholesterolDomainModel } from "../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.domain.model";
import { BloodCholesterolDto } from "../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.dto";
import { BloodCholesterolSearchFilters,
    BloodCholesterolSearchResults
} from "../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.search.types";

export interface IBloodCholesterolRepo {

    create(bloodCholesterolDomainModel: BloodCholesterolDomainModel): Promise<BloodCholesterolDto>;

    getById(id: string): Promise<BloodCholesterolDto>;

    search(filters: BloodCholesterolSearchFilters): Promise<BloodCholesterolSearchResults>;

    update(id: string, bloodCholesterolDomainModel: BloodCholesterolDomainModel):
    Promise<BloodCholesterolDto>;

    delete(id: string): Promise<boolean>;

    getStats(patientUserId: string, numMonths: number): Promise<any>;

}

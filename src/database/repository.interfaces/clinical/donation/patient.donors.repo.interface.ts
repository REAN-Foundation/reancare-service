import { PatientDonorsDomainModel } from "../../../../domain.types/clinical/donation/patient.donors.domain.model";
import { PatientDonorsDto } from "../../../../domain.types/clinical/donation/patient.donors.dto";
import { PatientDonorsSearchFilters, PatientDonorsSearchResults } from "../../../../domain.types/clinical/donation/patient.donors.search.types";

export interface IPatientDonorsRepo {

    create(entity: PatientDonorsDomainModel): Promise<PatientDonorsDto>;

    getById(userId: string): Promise<PatientDonorsDto>;

    update(userId: string, updateModel: PatientDonorsDomainModel): Promise<PatientDonorsDto>;

    search(filters: PatientDonorsSearchFilters): Promise<PatientDonorsSearchResults>;
    
    delete(userId: string): Promise<boolean>;

}

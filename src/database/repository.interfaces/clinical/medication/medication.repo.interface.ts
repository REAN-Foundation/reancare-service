import { MedicationDomainModel } from "../../../../domain.types/clinical/medication/medication/medication.domain.model";
import { MedicationDto } from "../../../../domain.types/clinical/medication/medication/medication.dto";
import { MedicationSearchFilters, MedicationSearchResults } from "../../../../domain.types/clinical/medication/medication/medication.search.types";

///////////////////////////////////////////////////////////////////////

export interface IMedicationRepo {

    create(medicationDomainModel: MedicationDomainModel): Promise<MedicationDto>;

    getById(id: string): Promise<MedicationDto>;

    getCurrentMedications(patientUserId: string): Promise<MedicationDto[]>;

    search(filters: MedicationSearchFilters): Promise<MedicationSearchResults>;

    update(id: string, medicationDomainModel: MedicationDomainModel): Promise<MedicationDto>;

    delete(id: string): Promise<boolean>;

}

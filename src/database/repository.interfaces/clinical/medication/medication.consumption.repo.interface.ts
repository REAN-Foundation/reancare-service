import { MedicationConsumptionDomainModel } from "../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model";
import { MedicationConsumptionDto } from "../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto";
import { MedicationConsumptionSearchFilters, MedicationConsumptionSearchResults } from "../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.search.types";

///////////////////////////////////////////////////////////////////////

export interface IMedicationConsumptionRepo {

    markAsTaken(id: string): Promise<MedicationConsumptionDto>;

    markAsMissed(id: string): Promise<MedicationConsumptionDto>;

    // markListAsTaken(ids: string[]): Promise<MedicationConsumptionDto>;

    // markListAsMissed(ids: string[]): Promise<MedicationConsumptionDto>;

    create(model: MedicationConsumptionDomainModel): Promise<MedicationConsumptionDto>;

    getById(id: string): Promise<MedicationConsumptionDto>;

    getCurrentMedications(patientUserId: string): Promise<MedicationConsumptionDto[]>;

    search(filters: MedicationConsumptionSearchFilters): Promise<MedicationConsumptionSearchResults>;

    update(id: string, model: MedicationConsumptionDomainModel): Promise<MedicationConsumptionDto>;

    delete(id: string): Promise<boolean>;

}

import { MedicationConsumptionDomainModel } from "../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model";
import { MedicationConsumptionDetailsDto, MedicationConsumptionDto } from "../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto";
import { MedicationConsumptionSearchFilters, MedicationConsumptionSearchResults } from "../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.search.types";

///////////////////////////////////////////////////////////////////////

export interface IMedicationConsumptionRepo {

    create(model: MedicationConsumptionDomainModel): Promise<MedicationConsumptionDto>;

    getById(id: string): Promise<MedicationConsumptionDetailsDto>;

    markAsTaken(id: string, takenAt: Date): Promise<MedicationConsumptionDetailsDto>;

    markAsMissed(id: string): Promise<MedicationConsumptionDetailsDto>;

    deleteFutureMedicationSchedules(medicationId: string): Promise<number>;

    // updateTimeZoneForFutureMedicationSchedules(
    //     medicationId: string,
    //     currentTimeZone: string,
    //     newTimeZone: string): Promise<number>;

    search(filters: MedicationConsumptionSearchFilters): Promise<MedicationConsumptionSearchResults>;

    getSchedulesForPatientForDuration(patientUserId: string, from: Date, to: Date): Promise<MedicationConsumptionDto[]>;

    getSchedulesForDuration(from: Date, to: Date): Promise<MedicationConsumptionDto[]>;

    getSchedulesForDay(patientUserId: string, date: Date): Promise<MedicationConsumptionDto[]>;

}

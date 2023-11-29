import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { MedicationConsumptionDomainModel } from "../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model";
import { MedicationConsumptionDetailsDto, MedicationConsumptionDto } from "../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto";
import { MedicationConsumptionSearchFilters, MedicationConsumptionSearchResults } from "../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.search.types";

///////////////////////////////////////////////////////////////////////

export interface IMedicationConsumptionRepo {

    getPendingConsumptionCountForMedication(medicationId: string): Promise<number>;

    getTotalConsumptionCountForMedication(medicationId: string): Promise<number>;

    create(model: MedicationConsumptionDomainModel): Promise<MedicationConsumptionDto>;

    getById(id: string): Promise<MedicationConsumptionDetailsDto>;

    getByMedicationId(id: string): Promise<MedicationConsumptionDetailsDto[]>;

    markAsTaken(id: string, takenAt: Date): Promise<MedicationConsumptionDetailsDto>;

    assignEhrId(id: string, ehrId: string): Promise<MedicationConsumptionDetailsDto>;

    markAsMissed(id: string): Promise<MedicationConsumptionDetailsDto>;

    deleteFutureMedicationSchedules(medicationId: string): Promise<number>;

    getSchedulesForMedication(medicationId: string): Promise<MedicationConsumptionDto[]>;

    // updateTimeZoneForFutureMedicationSchedules(
    //     medicationId: string,
    //     currentTimeZone: string,
    //     newTimeZone: string): Promise<number>;

    search(filters: MedicationConsumptionSearchFilters): Promise<MedicationConsumptionSearchResults>;

    getAllTakenBefore(patientUserId: uuid, date: Date): Promise<any[]>;

    getAllTakenBetween(patientUserId: uuid, from: Date, to: Date): Promise<any[]>;

    getSchedulesForPatientForDuration(patientUserId: string, from: Date, to: Date): Promise<MedicationConsumptionDto[]>;

    getSchedulesForDuration(from: Date, to: Date, filterTaken: boolean): Promise<MedicationConsumptionDto[]>;

    getSchedulesForDay(patientUserId: string, date: Date): Promise<MedicationConsumptionDto[]>;

    cancelSchedule(id: string): Promise<boolean>;

    getStats(patientUserId: string, numMonths: number): Promise<any>;

}

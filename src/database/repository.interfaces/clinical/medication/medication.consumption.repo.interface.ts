import { MedicationConsumptionDomainModel } from "../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.domain.model";
import { ConsumptionSummaryDto, ConsumptionSummaryForMonthDto, MedicationConsumptionDetailsDto, MedicationConsumptionDto } from "../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto";
import { MedicationConsumptionSearchFilters, MedicationConsumptionSearchResults } from "../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.search.types";

///////////////////////////////////////////////////////////////////////

export interface IMedicationConsumptionRepo {

    create(model: MedicationConsumptionDomainModel): Promise<MedicationConsumptionDto>;

    getById(id: string): Promise<MedicationConsumptionDetailsDto>;

    markAsTaken(id: string, takenAt: Date): Promise<MedicationConsumptionDetailsDto>;

    markAsMissed(id: string): Promise<MedicationConsumptionDetailsDto>;

    cancelFutureMedicationSchedules(medicationId: string): Promise<number>;

    deleteFutureMedicationSchedules(medicationId: string): Promise<number>;

    // updateTimeZoneForFutureMedicationSchedules(
    //     medicationId: string,
    //     currentTimeZone: string,
    //     newTimeZone: string): Promise<number>;

    search(filters: MedicationConsumptionSearchFilters): Promise<MedicationConsumptionSearchResults>;

    getScheduleForDuration(patientUserId: string, duration: string, when: string): Promise<MedicationConsumptionDto[]>;

    getScheduleForDay(patientUserId: string, date: Date, groupByDrug: boolean): Promise<MedicationConsumptionDto[]>;

    getSummaryForDay(patientUserId: string, date: Date): Promise<ConsumptionSummaryDto>;

    getSummaryByCalendarMonths(patientUserId: string, pastMonthsCount: number,
        futureMonthsCount: number): Promise<ConsumptionSummaryForMonthDto[]>;

}

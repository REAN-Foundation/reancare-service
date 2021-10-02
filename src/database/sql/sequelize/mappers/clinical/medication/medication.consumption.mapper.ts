import { MedicationAdministrationRoutes, MedicationDosageUnits, MedicationDurationUnits, MedicationFrequencyUnits, MedicationTimeSchedules } from '../../../../../../domain.types/clinical/medication/medication/medication.types';
import { MedicationDto } from '../../../../../../domain.types/clinical/medication/medication/medication.dto';
import MedicationConsumptionModel from '../../../models/clinical/medication/medication.consumption.model';
import { MedicationConsumptionDto } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto';

///////////////////////////////////////////////////////////////////////////////////

export class MedicationConsumptionMapper {

    static toDto = (medicationConsumption: MedicationConsumptionModel): MedicationConsumptionDto => {
        
        if (medicationConsumption == null) {
            return null;
        }

        var schedules: MedicationTimeSchedules[] = JSON.parse(medicationConsumption.TimeSchedules) as MedicationTimeSchedules[];

        const dto: MedicationDto = {
            id                        : medicationConsumption.id,
            EhrId                     : medicationConsumption.EhrId,
            PatientUserId             : medicationConsumption.PatientUserId,
            MedicalPractitionerUserId : medicationConsumption.MedicalPractitionerUserId,
            VisitId                   : medicationConsumption.VisitId,
            OrderId                   : medicationConsumption.OrderId,
            DrugId                    : medicationConsumption.DrugId,
            Dose                      : medicationConsumption.Dose,
            DosageUnit                : medicationConsumption.DosageUnit as MedicationDosageUnits,
            TimeSchedules             : schedules,
            Frequency                 : medicationConsumption.Frequency,
            FrequencyUnit             : medicationConsumption.FrequencyUnit as MedicationFrequencyUnits,
            Route                     : medicationConsumption.Route as MedicationAdministrationRoutes,
            Duration                  : medicationConsumption.Duration,
            DurationUnit              : medicationConsumption.DurationUnit as MedicationDurationUnits,
            StartDate                 : medicationConsumption.StartDate,
            EndDate                   : medicationConsumption.EndDate,
            RefillNeeded              : medicationConsumption.RefillNeeded,
            RefillCount               : medicationConsumption.RefillCount,
            Instructions              : medicationConsumption.Instructions,
            ImageResourceId           : medicationConsumption.ImageResourceId,
            IsExistingMedication      : medicationConsumption.IsExistingMedication,
            TakenForLastNDays         : medicationConsumption.TakenForLastNDays,
            ToBeTakenForNextNDays     : medicationConsumption.ToBeTakenForNextNDays,
            IsCancelled               : medicationConsumption.IsCancelled,
        };
        return dto;
    }

}

import { MedicationAdministrationRoutes, MedicationDosageUnits, MedicationDurationUnits, MedicationFrequencyUnits, MedicationTimeSchedules } from '../../../../../../domain.types/clinical/medication/medication/medication.types';
import { MedicationDto } from '../../../../../../domain.types/clinical/medication/medication/medication.dto';
import MedicationModel from '../../../models/clinical/medication/medication.model';

///////////////////////////////////////////////////////////////////////////////////

export class MedicationMapper {

    static toDto = (medication: MedicationModel): MedicationDto => {
        
        if (medication == null) {
            return null;
        }

        var schedules: MedicationTimeSchedules[] = JSON.parse(medication.TimeSchedules) as MedicationTimeSchedules[];

        const dto: MedicationDto = {
            id                        : medication.id,
            EhrId                     : medication.EhrId,
            PatientUserId             : medication.PatientUserId,
            MedicalPractitionerUserId : medication.MedicalPractitionerUserId,
            VisitId                   : medication.VisitId,
            OrderId                   : medication.OrderId,
            DrugId                    : medication.DrugId,
            Dose                      : medication.Dose,
            DosageUnit                : medication.DosageUnit as MedicationDosageUnits,
            TimeSchedules             : schedules,
            Frequency                 : medication.Frequency,
            FrequencyUnit             : medication.FrequencyUnit as MedicationFrequencyUnits,
            Route                     : medication.Route as MedicationAdministrationRoutes,
            Duration                  : medication.Duration,
            DurationUnit              : medication.DurationUnit as MedicationDurationUnits,
            StartDate                 : medication.StartDate,
            EndDate                   : medication.EndDate,
            RefillNeeded              : medication.RefillNeeded,
            RefillCount               : medication.RefillCount,
            Instructions              : medication.Instructions,
            ImageResourceId           : medication.ImageResourceId,
            IsExistingMedication      : medication.IsExistingMedication,
            TakenForLastNDays         : medication.TakenForLastNDays,
            ToBeTakenForNextNDays     : medication.ToBeTakenForNextNDays,
            IsCancelled               : medication.IsCancelled,
        };
        return dto;
    }

}

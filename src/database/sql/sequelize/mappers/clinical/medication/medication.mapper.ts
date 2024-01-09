import { Helper } from '../../../../../../common/helper';
import { MedicationDto } from '../../../../../../domain.types/clinical/medication/medication/medication.dto';
import { MedicationAdministrationRoutes, MedicationDosageUnits, MedicationDurationUnits, MedicationFrequencyUnits, MedicationTimeSchedules } from '../../../../../../domain.types/clinical/medication/medication/medication.types';
import MedicationModel from '../../../models/clinical/medication/medication.model';

///////////////////////////////////////////////////////////////////////////////////

export class MedicationMapper {

    static toDto = (medication: MedicationModel): MedicationDto => {
        
        if (medication == null) {
            return null;
        }

        var schedules: MedicationTimeSchedules[] = JSON.parse(medication.TimeSchedules) as MedicationTimeSchedules[];

        var refillCount = typeof medication.RefillCount === 'string' ? parseInt(medication.RefillCount) : medication.RefillCount;

        const dto: MedicationDto = {
            id                        : medication.id,
            EhrId                     : medication.EhrId,
            PatientUserId             : medication.PatientUserId,
            MedicalPractitionerUserId : medication.MedicalPractitionerUserId,
            VisitId                   : medication.VisitId,
            OrderId                   : medication.OrderId,
            DrugId                    : medication.DrugId,
            DrugName                  : medication.DrugName,
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
            RefillCount               : refillCount,
            Instructions              : medication.Instructions,
            ImageResourceId           : medication.ImageResourceId,
            IsExistingMedication      : medication.IsExistingMedication,
            TakenForLastNDays         : medication.TakenForLastNDays,
            ToBeTakenForNextNDays     : medication.ToBeTakenForNextNDays,
            IsCancelled               : medication.IsCancelled,
        };

        dto.Dose = Helper.parseIntegerFromString(dto.Dose.toString()) ?? dto.Dose;
        return dto;
    };

}

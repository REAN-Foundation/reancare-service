import { MedicationAdministrationRoutes, MedicationDosageUnits, MedicationDurationUnits, MedicationFrequencyUnits, MedicationTimeSchedules } from '../../../../../../domain.types/clinical/medication/medication/medication.types';
import { MedicationDto } from '../../../../../../domain.types/clinical/medication/medication/medication.dto';
import MedicationConsumptionModel from '../../../models/clinical/medication/medication.consumption.model';
import { MedicationConsumptionDto } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto';
import { MedicationConsumptionStatus } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.types';

///////////////////////////////////////////////////////////////////////////////////

export class MedicationConsumptionMapper {

    static getConsumptionStatus = (medicationConsumption: MedicationConsumptionModel): MedicationConsumptionStatus => {
        
        var status = 'none';

        if (element.IsTaken == false &&
            element.IsMissed == false &&
            element.IsCancelled == false &&
            moment(Date.now()).isAfter(moment(element.TimeScheduleStart))) {

            if (moment(Date.now()).isAfter(moment(element.TimeScheduleEnd).add(3, 'hours'))) {
                status = 'unknown';
            }
            else {
                status = 'overdue';
            }
        }
        else if (element.IsCancelled == true && element.CancelledOn != null) {
            status = 'cancelled';
        }
        else if (element.IsTaken == true && element.TakenAt != null) {
            status = 'taken';
        }
        else if (element.IsMissed == true) {
            status = 'missed';
        }
        else if (moment(Date.now()).isBefore(moment(element.TimeScheduleStart))) {
            status = 'upcoming';
        }
        return status;
    }

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

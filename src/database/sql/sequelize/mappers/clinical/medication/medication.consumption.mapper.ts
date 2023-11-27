import { TimeHelper } from '../../../../../../common/time.helper';
import { MedicationConsumptionDetailsDto, MedicationConsumptionDto } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto';
import { MedicationConsumptionStatus } from '../../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.types';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';
import MedicationConsumptionModel from '../../../models/clinical/medication/medication.consumption.model';

///////////////////////////////////////////////////////////////////////////////////

export class MedicationConsumptionMapper {

    static getConsumptionStatus = (consumption: MedicationConsumptionModel): MedicationConsumptionStatus => {
        
        var status = MedicationConsumptionStatus.Unknown;

        var overdueOnsetDurationInHours = 3;
        var pastScheduledStart = TimeHelper.isAfter(new Date(), consumption.TimeScheduleStart);
        var overdueOnsetTime = TimeHelper.addDuration(
            consumption.TimeScheduleEnd,
            overdueOnsetDurationInHours,
            DurationType.Hour);
        var pastOverdueOnset = TimeHelper.isAfter(new Date(), overdueOnsetTime);
        var beforeScheduledStart = TimeHelper.isBefore(new Date(), consumption.TimeScheduleStart);

        if (consumption.IsTaken === false &&
            consumption.IsMissed === false &&
            consumption.IsCancelled === false &&
            pastScheduledStart) {

            if (pastOverdueOnset) {
                status = MedicationConsumptionStatus.Unknown; //'unknown';
            }
            else {
                status = MedicationConsumptionStatus.Overdue; //'overdue';
            }
        }
        else if (consumption.IsCancelled === true && consumption.CancelledOn !== null) {
            status = MedicationConsumptionStatus.Cancelled; //'cancelled';
        }
        else if (consumption.IsTaken === true && consumption.TakenAt !== null) {
            status = MedicationConsumptionStatus.Taken; //'taken';
        }
        else if (consumption.IsMissed === true) {
            status = MedicationConsumptionStatus.Missed; //'missed';
        }
        else if (beforeScheduledStart) {
            status = MedicationConsumptionStatus.Upcoming; //'upcoming';
        }
        return status;
    };

    static toDto = (consumption: MedicationConsumptionModel): MedicationConsumptionDto => {
        
        if (consumption == null) {
            return null;
        }

        var status = MedicationConsumptionMapper.getConsumptionStatus(consumption);

        const dto: MedicationConsumptionDto = {
            id                : consumption.id,
            PatientUserId     : consumption.PatientUserId,
            DrugName          : consumption.DrugName,
            Details           : consumption.Details,
            TimeScheduleStart : consumption.TimeScheduleStart,
            TimeScheduleEnd   : consumption.TimeScheduleEnd,
            Status            : status,
            CreatedAt         : consumption.CreatedAt,
            UpdatedAt         : consumption.UpdatedAt,

        };
        
        return dto;
    };
    
    static toDetailsDto = (consumption: MedicationConsumptionModel): MedicationConsumptionDetailsDto => {
        
        if (consumption == null) {
            return null;
        }

        var status = MedicationConsumptionMapper.getConsumptionStatus(consumption);

        const dto: MedicationConsumptionDetailsDto = {
            id                : consumption.id,
            EhrId             : consumption.EhrId,
            PatientUserId     : consumption.PatientUserId,
            MedicationId      : consumption.MedicationId,
            DrugName          : consumption.DrugName,
            DrugId            : consumption.DrugId,
            Dose              : consumption.Dose,
            Details           : consumption.Details,
            TimeScheduleStart : consumption.TimeScheduleStart,
            TimeScheduleEnd   : consumption.TimeScheduleEnd,
            IsTaken           : consumption.IsTaken,
            TakenAt           : consumption.TakenAt,
            IsMissed          : consumption.IsMissed,
            IsCancelled       : consumption.IsCancelled,
            CancelledOn       : consumption.CancelledOn,
            Note              : consumption.Note,
            Status            : status,
            CreatedAt         : consumption.CreatedAt,
            UpdatedAt         : consumption.UpdatedAt,

        };

        return dto;
    };

}

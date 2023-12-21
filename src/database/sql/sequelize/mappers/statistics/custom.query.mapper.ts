import StatisticsCustomQueries from '../../models/statistics/custom.query.model';
import { BloodCholesterolSummaryDto, BloodGlucoseSummaryDto, BloodOxygenSaturationSummaryDto, BloodPressureSummaryDto, BodyHeightSummaryDto, BodyWeightSummaryDto, CustomQueryDto, EmergencyEventSummaryDto, HealthProfileSummaryDto, LabRecordSummaryDto, MedicationConsumptionSummaryDto, PulseSummaryDto } from '../../../../../domain.types/statistics/custom.query/custom.query.dto';
import { HealthProfileDto } from '../../../../../domain.types/users/patient/health.profile/health.profile.dto';
import { MedicationConsumptionDto } from '../../../../../domain.types/clinical/medication/medication.consumption/medication.consumption.dto';
import { BloodCholesterolDto } from '../../../../../domain.types/clinical/biometrics/blood.cholesterol/blood.cholesterol.dto';
import { BloodGlucoseDto } from '../../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto';
import { BloodOxygenSaturationDto } from '../../../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto';
import { BloodPressureDto } from '../../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto';
import { BodyHeightDto } from '../../../../../domain.types/clinical/biometrics/body.height/body.height.dto';
import { BodyWeightDto } from '../../../../../domain.types/clinical/biometrics/body.weight/body.weight.dto';
import { PulseDto } from '../../../../../domain.types/clinical/biometrics/pulse/pulse.dto';
import { LabRecordDto } from '../../../../../domain.types/clinical/lab.record/lab.record/lab.record.dto';
import { EmergencyEventDto } from '../../../../../domain.types/clinical/emergency.event/emergency.event.dto';

///////////////////////////////////////////////////////////////////////////////////

export class CustomQueryMapper {

    static toDto = (customQuery: StatisticsCustomQueries): CustomQueryDto => {
        if (customQuery == null){
            return null;
        }
        var tags = [];
        if (customQuery.Tags !== null && customQuery.Tags !== undefined) {
            tags = JSON.parse(customQuery.Tags);
        }
        const dto: CustomQueryDto = {
            id          : customQuery.id,
            Name        : customQuery.Name,
            Description : customQuery.Description,
            UserId      : customQuery.UserId,
            TenantId    : customQuery.TenantId,
            Query       : customQuery.Query,
            Tags        : tags
        };
        return dto;
    };

    static toHealthProfileSummaryDto = (healthProfile: HealthProfileDto): HealthProfileSummaryDto => {
        if (healthProfile === null) {
            return null;
        }
        const dto: HealthProfileSummaryDto = {
            BloodGroup            : healthProfile.BloodGroup,
            MajorAilment          : healthProfile.MajorAilment,
            OtherConditions       : healthProfile.OtherConditions,
            IsDiabetic            : healthProfile.IsDiabetic,
            HasHighBloodPressure  : healthProfile.HasHighBloodPressure,
            HasHighCholesterol    : healthProfile.HasHighCholesterol,
            HasAtrialFibrillation : healthProfile.HasAtrialFibrillation,
            HasHeartAilment       : healthProfile.HasHeartAilment,
            MaritalStatus         : healthProfile.MaritalStatus,
            Ethnicity             : healthProfile.Ethnicity,
            Race                  : healthProfile.Race,
            SedentaryLifestyle    : healthProfile.SedentaryLifestyle,
            Tobacco               : healthProfile.IsSmoker,
            IsAlcoholic           : healthProfile.IsDrinker,
            SubstanceAbuser       : healthProfile.SubstanceAbuse,
            ProcedureHistory      : healthProfile.ProcedureHistory,
            ObstetricHistory      : healthProfile.ObstetricHistory,
            OtherInformation      : healthProfile.OtherInformation,
            LivingAlone           : healthProfile.LivingAlone
        };
        return dto;
    };
    
    static toMedicationConsumptionSummaryDto =
    (medicationConsumption: MedicationConsumptionDto): MedicationConsumptionSummaryDto => {
        if (medicationConsumption === null) {
            return null;
        }

        const dto: MedicationConsumptionSummaryDto = {
            DrugName          : medicationConsumption.DrugName,
            Details           : medicationConsumption.Details,
            TimeScheduleStart : medicationConsumption.TimeScheduleStart,
            TimeScheduleEnd   : medicationConsumption.TimeScheduleEnd,
            Status            : medicationConsumption.Status
        };
        return dto;
    };

    static toBloodCholesterolSummaryDto = (bloodCholesterol: BloodCholesterolDto): BloodCholesterolSummaryDto => {
        if (bloodCholesterol === null) {
            return null;
        }
        const dto: BloodCholesterolSummaryDto = {
            TotalCholesterol  : bloodCholesterol.TotalCholesterol,
            HDL               : bloodCholesterol.HDL,
            LDL               : bloodCholesterol.LDL,
            TriglycerideLevel : bloodCholesterol.TriglycerideLevel,
            Ratio             : bloodCholesterol.Ratio,
            A1CLevel          : bloodCholesterol.A1CLevel,
            Unit              : bloodCholesterol.Unit,
            RecordDate        : bloodCholesterol.RecordDate
        };

        return dto;
    };

    static toBloodGlucoseSummaryDto = (bloodGlucose: BloodGlucoseDto): BloodGlucoseSummaryDto => {
        if (bloodGlucose === null) {
            return null;
        }

        const dto: BloodGlucoseSummaryDto = {
            BloodGlucose : bloodGlucose.BloodGlucose,
            Unit         : bloodGlucose.Unit,
            RecordDate   : bloodGlucose.RecordDate
        };

        return dto;
    };

    static toBloodOxygenSaturationSummaryDto =
     (bloodOxygenSaturation: BloodOxygenSaturationDto): BloodOxygenSaturationSummaryDto => {
         if (bloodOxygenSaturation === null) {
             return null;
         }

         const dto: BloodOxygenSaturationSummaryDto = {
             BloodOxygenSaturation : bloodOxygenSaturation.BloodOxygenSaturation,
             Unit                  : bloodOxygenSaturation.Unit,
             RecordDate            : bloodOxygenSaturation.RecordDate
         };

         return dto;
     };

     static toBloodPressureSummaryDto = (bloodPressure: BloodPressureDto): BloodPressureSummaryDto => {
         if (bloodPressure === null) {
             return null;
         }

         const dto: BloodPressureSummaryDto = {
             Systolic   : bloodPressure.Systolic,
             Diastolic  : bloodPressure.Diastolic,
             Unit       : bloodPressure.Unit,
             RecordDate : bloodPressure.RecordDate
         };

         return dto;
     };

     static toBodyHeightSummaryDto = (bodyHeight:BodyHeightDto): BodyHeightSummaryDto => {
         if (bodyHeight === null){
             return null;
         }

         const dto: BodyHeightSummaryDto = {
             BodyHeight : bodyHeight.BodyHeight,
             Unit       : bodyHeight.Unit,
             RecordDate : bodyHeight.RecordDate
         };

         return dto;
     };

     static toBodyWeightSummaryDto = (bodyWeight: BodyWeightDto): BodyWeightSummaryDto => {
         if (bodyWeight === null) {
             return null;
         }

         const dto: BodyWeightSummaryDto = {
             BodyWeight : bodyWeight.BodyWeight,
             Unit       : bodyWeight.Unit,
             RecordDate : bodyWeight.RecordDate
         };

         return dto;
     };

     static toPulseSummaryDto = (pulse:PulseDto): PulseSummaryDto => {
         if (pulse === null) {
             return null;
         }

         const dto: PulseSummaryDto = {
             Pulse      : pulse.Pulse,
             Unit       : pulse.Unit,
             RecordDate : pulse.RecordDate
         };

         return dto;
     };

     static toLabRecordSummaryDto = (labRecord:LabRecordDto): LabRecordSummaryDto => {
         if (labRecord === null) {
             return null;
         }

         const dto: LabRecordSummaryDto = {
             TypeName       : labRecord.TypeName,
             DisplayName    : labRecord.DisplayName,
             PrimaryValue   : labRecord.PrimaryValue,
             SecondaryValue : labRecord.SecondaryValue,
             Unit           : labRecord.Unit,
             RecordedAt     : labRecord.RecordedAt
         };

         return dto;
     };

     static toEmergencyEventSummaryDto = (emergencyEvent: EmergencyEventDto): EmergencyEventSummaryDto => {
         if (emergencyEvent === null) {
             return null;
         }

         const dto: EmergencyEventSummaryDto = {
             Details       : emergencyEvent.Details,
             EmergencyDate : emergencyEvent.EmergencyDate
         };

         return dto;
     };

}

import StatisticsCustomQueries from '../../models/statistics/custom.query.model';
import { CustomQueryDto } from '../../../../../domain.types/statistics/custom.query/custom.query.dto';
import { HealthProfileDto } from '../../../../../domain.types/users/patient/health.profile/health.profile.dto';
import { BloodGlucoseDto } from '../../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto';
import { BloodOxygenSaturationDto } from '../../../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto';
import { BloodPressureDto } from '../../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto';
import { BodyHeightDto } from '../../../../../domain.types/clinical/biometrics/body.height/body.height.dto';
import { BodyWeightDto } from '../../../../../domain.types/clinical/biometrics/body.weight/body.weight.dto';
import { PulseDto } from '../../../../../domain.types/clinical/biometrics/pulse/pulse.dto';
import { LabRecordDto } from '../../../../../domain.types/clinical/lab.record/lab.record/lab.record.dto';
import { EmergencyEventDto } from '../../../../../domain.types/clinical/emergency.event/emergency.event.dto';
import { MedicationDto } from '../../../../../domain.types/clinical/medication/medication/medication.dto';

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

    static toHealthProfileSummaryDto = (healthProfile: HealthProfileDto): HealthProfileDto => {
        if (healthProfile === null) {
            return null;
        }
        const dto: HealthProfileDto = {
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
            IsSmoker              : healthProfile.IsSmoker,
            IsDrinker             : healthProfile.IsDrinker,
            SubstanceAbuse        : healthProfile.SubstanceAbuse,
            ProcedureHistory      : healthProfile.ProcedureHistory,
            ObstetricHistory      : healthProfile.ObstetricHistory,
            OtherInformation      : healthProfile.OtherInformation,
            LivingAlone           : healthProfile.LivingAlone
        };
        return dto;
    };
    
    static toMedicationSummaryDto =
    (medication: MedicationDto): MedicationDto => {
        if (medication === null) {
            return null;
        }

        const dto: MedicationDto = {
            DrugName  : medication.DrugName,
            Dose      : medication.Dose,
            Frequency : medication.Frequency,
            Duration  : medication.Duration
        };
        return dto;
    };

    static toBloodGlucoseSummaryDto = (bloodGlucose: BloodGlucoseDto): BloodGlucoseDto => {
        if (bloodGlucose === null) {
            return null;
        }

        const dto: BloodGlucoseDto = {
            BloodGlucose : bloodGlucose.BloodGlucose,
            Unit         : bloodGlucose.Unit,
            RecordDate   : bloodGlucose.RecordDate
        };

        return dto;
    };

    static toBloodOxygenSaturationSummaryDto =
     (bloodOxygenSaturation: BloodOxygenSaturationDto): BloodOxygenSaturationDto => {
         if (bloodOxygenSaturation === null) {
             return null;
         }

         const dto: BloodOxygenSaturationDto = {
             BloodOxygenSaturation : bloodOxygenSaturation.BloodOxygenSaturation,
             Unit                  : bloodOxygenSaturation.Unit,
             RecordDate            : bloodOxygenSaturation.RecordDate
         };

         return dto;
     };

     static toBloodPressureSummaryDto = (bloodPressure: BloodPressureDto): BloodPressureDto => {
         if (bloodPressure === null) {
             return null;
         }

         const dto: BloodPressureDto = {
             Systolic   : bloodPressure.Systolic,
             Diastolic  : bloodPressure.Diastolic,
             Unit       : bloodPressure.Unit,
             RecordDate : bloodPressure.RecordDate
         };

         return dto;
     };

     static toBodyHeightSummaryDto = (bodyHeight:BodyHeightDto): BodyHeightDto => {
         if (bodyHeight === null){
             return null;
         }

         const dto: BodyHeightDto = {
             BodyHeight : bodyHeight.BodyHeight,
             Unit       : bodyHeight.Unit,
             RecordDate : bodyHeight.RecordDate
         };

         return dto;
     };

     static toBodyWeightSummaryDto = (bodyWeight: BodyWeightDto): BodyWeightDto => {
         if (bodyWeight === null) {
             return null;
         }

         const dto: BodyWeightDto = {
             BodyWeight : bodyWeight.BodyWeight,
             Unit       : bodyWeight.Unit,
             RecordDate : bodyWeight.RecordDate
         };

         return dto;
     };

     static toPulseSummaryDto = (pulse:PulseDto): PulseDto => {
         if (pulse === null) {
             return null;
         }

         const dto: PulseDto = {
             Pulse      : pulse.Pulse,
             Unit       : pulse.Unit,
             RecordDate : pulse.RecordDate
         };

         return dto;
     };

     static toLabRecordSummaryDto = (labRecord:LabRecordDto): LabRecordDto => {
         if (labRecord === null) {
             return null;
         }

         const dto: LabRecordDto = {
             TypeName       : labRecord.TypeName,
             DisplayName    : labRecord.DisplayName,
             PrimaryValue   : labRecord.PrimaryValue,
             SecondaryValue : labRecord.SecondaryValue,
             Unit           : labRecord.Unit,
             RecordedAt     : labRecord.RecordedAt
         };

         return dto;
     };

     static toEmergencyEventSummaryDto = (emergencyEvent: EmergencyEventDto): EmergencyEventDto => {
         if (emergencyEvent === null) {
             return null;
         }

         const dto: EmergencyEventDto = {
             Details       : emergencyEvent.Details,
             EmergencyDate : emergencyEvent.EmergencyDate
         };

         return dto;
     };

}

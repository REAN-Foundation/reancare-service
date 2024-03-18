import { uuid } from "../../miscellaneous/system.types";
import { BloodGlucoseDto } from "../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto";
import { BloodOxygenSaturationDto } from "../../../domain.types/clinical/biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto";
import { BloodPressureDto } from "../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto";
import { BodyHeightDto } from "../../../domain.types/clinical/biometrics/body.height/body.height.dto";
import { BodyWeightDto } from "../../../domain.types/clinical/biometrics/body.weight/body.weight.dto";
import { PulseDto } from "../../../domain.types/clinical/biometrics/pulse/pulse.dto";
import { LabRecordDto } from "../../../domain.types/clinical/lab.record/lab.record/lab.record.dto";
import { EmergencyEventDto } from "../../../domain.types/clinical/emergency.event/emergency.event.dto";
import { HealthProfileDto } from "../../../domain.types/users/patient/health.profile/health.profile.dto";
import { MedicationDto } from "../../../domain.types/clinical/medication/medication/medication.dto";

export interface CustomQueryDto {
  id?          : string;
  Name?        : string;
  Query?       : string;
  Format?      : string;
  Description? : string;
  Tags?        : string[];
  UserId?      : uuid;
  TenantId?    : uuid;
}

export interface HealthSummaryDto {
    HealthProfile?          :HealthProfileDto,
    Medication?             :MedicationDto[],
    BloodGlucose?           :BloodGlucoseDto[],
    BloodOxygenSaturation?  :BloodOxygenSaturationDto[],
    BloodPressure?          :BloodPressureDto[],
    BodyHeight?             :BodyHeightDto[],
    BodyWeight?             :BodyWeightDto[],
    Pulse?                  :PulseDto[],
    LabRecord?              :LabRecordDto[],
    EmergencyEvent?         :EmergencyEventDto[],
  }
 

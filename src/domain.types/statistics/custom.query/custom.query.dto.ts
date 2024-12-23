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
import { UserTaskDto } from "../../../domain.types/users/user.task/user.task.dto";
import { BodyTemperatureDto } from "../../../domain.types/clinical/biometrics/body.temperature/body.temperature.dto";
import { PersonDetailsDto } from "../../../domain.types/person/person.dto";

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
    BodyTemperature?        :BodyTemperatureDto[],
    Pulse?                  :PulseDto[],
    LabRecord?              :LabRecordDto[],
    EmergencyEvent?         :EmergencyEventDto[],
  }
 
export interface DashboardSummaryDto {
    TaskCount?: number;
    CompletedTaskCount?: number;
    PendingTaskCount?: number;
    HealthProfile?          :HealthProfileDto,
    UserProfile?            :PersonDetailsDto,
    BloodGlucose?           :BloodGlucoseDto[],
    BloodOxygenSaturation?  :BloodOxygenSaturationDto[],
    BloodPressure?          :BloodPressureDto[],
    BodyHeight?             :BodyHeightDto[],
    BodyWeight?             :BodyWeightDto[],
    BodyTemperature?        :BodyTemperatureDto[],
    Pulse?                  :PulseDto[],
    CarePlanTasks?          :UserTaskDto[],
    CompletedTasks?         :UserTaskDto[],
  }

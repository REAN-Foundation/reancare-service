import { decimal, uuid } from "../../miscellaneous/system.types";
import { MedicationConsumptionStatus } from "../../../domain.types/clinical/medication/medication.consumption/medication.consumption.types";

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
    HealthProfile?          :HealthProfileSummaryDto,
    CurrentMedication?      :MedicationConsumptionSummaryDto[],
    BloodCholesterol?       :BloodCholesterolSummaryDto[],
    BloodGlucose?           :BloodGlucoseSummaryDto[],
    BloodOxygenSaturation?  :BloodOxygenSaturationSummaryDto[],
    BloodPressure?          :BloodPressureSummaryDto[],
    BodyHeight?             :BodyHeightSummaryDto[],
    BodyWeight?             :BodyWeightSummaryDto[],
    Pulse?                  :PulseSummaryDto[],
    LabRecord?              :LabRecordSummaryDto[],
    EmergencyEvent?         :EmergencyEventSummaryDto[],
  }
  
export interface HealthProfileSummaryDto {
      BloodGroup?                : string;
      MajorAilment?              : string;
      OtherConditions?           : string;
      IsDiabetic?                : boolean;
      HasHighBloodPressure?      : boolean;
      HasHighCholesterol?        : boolean;
      HasAtrialFibrillation?     : boolean;
      HasHeartAilment?           : boolean;
      MaritalStatus?             : string;
      Ethnicity?                 : string;
      Race?                      : string;
      SedentaryLifestyle?        : boolean;
      Tobacco?                   : boolean;
      IsAlcoholic                : boolean;
      SubstanceAbuser?           : boolean;
      ProcedureHistory?          : string;
      ObstetricHistory?          : string;
      OtherInformation?          : string;
      LivingAlone?               : boolean;
  }
  
export interface MedicationConsumptionSummaryDto {
      DrugName?         : string;
      Details?          : string;
      TimeScheduleStart?: Date;
      TimeScheduleEnd?  : Date;
      Status?           : MedicationConsumptionStatus;
  }
  
export interface BloodCholesterolSummaryDto {
      TotalCholesterol?  : number;
      HDL?               : number;
      LDL?               : number;
      TriglycerideLevel? : number;
      Ratio?             : number;
      A1CLevel?          : number;
      Unit?              : string;
      RecordDate?        : Date;
  }
  
export interface BloodGlucoseSummaryDto {
      BloodGlucose      : number;
      Unit              : string;
      RecordDate?       : Date;
  }
  
export interface BloodOxygenSaturationSummaryDto {
      BloodOxygenSaturation: number;
      Unit                 : string;
      RecordDate?          : Date;
  }
  
export interface BloodPressureSummaryDto {
      Systolic         : number;
      Diastolic        : number;
      Unit             : string;
      RecordDate?      : Date;
   }
  
export interface BodyHeightSummaryDto {
      BodyHeight: number;
      Unit: string;
      RecordDate?: Date;
  }
  
export interface BodyWeightSummaryDto {
    BodyWeight       : number
    Unit             : string;
    RecordDate?      : Date;
  }
  
export interface PulseSummaryDto {
      Pulse            : number;
      Unit             : string;
      RecordDate?      : Date;
  }
  
export interface LabRecordSummaryDto {
      TypeName ?      : string;
      DisplayName ?   : string;
      PrimaryValue?   : decimal;
      SecondaryValue? : decimal;
      Unit?           : string;
      RecordedAt?     : Date;
  }
  
export interface EmergencyEventSummaryDto {
      Details?: string;
      EmergencyDate?: Date;
    }
  

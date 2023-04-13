import { HeartRateDataSample, UploadType } from './daily.domain.model';
import { EventStatus, EventType, Option, TerraUser } from './webhook.event';

export interface SleepDomainModel {
  Status            : EventStatus;
  Type              : EventType;
  User              : TerraUser;
  Data              : Sleep;
  Version           : Date;
}
export interface Sleep {
  SleepDurationsData: {
    Other: {
      DurationInBedSeconds: Option<number>;
      DurationUnmeasurableSleepSeconds: Option<number>;
    };
    SleepEfficiency: Option<number>;
    Awake: {
      DurationShortInterruptionSeconds: Option<number>;
      DurationAwakeStateSeconds: Option<number>;
      DurationLongInterruptionSeconds: Option<number>;
      NumWakeupEvents: Option<number>;
      WakeUpLatencySeconds: Option<number>;
      NumOutOfBedEvents: Option<number>;
      SleepLatencySeconds: Option<number>;
    };
    Asleep: {
      DurationLightSleepStateSeconds: Option<number>;
      DurationAsleepStateSeconds: Option<number>;
      NumREMEvents: Option<number>;
      DurationREMSleepStateSeconds: Option<number>;
      DurationDeepSleepStateSeconds: Option<number>;
    };
  };
  MetaData: {
    EndTime: string;
    StartTime: string;
    UploadType: UploadType;
    IsNap: boolean;
  };
  HeartRateData?: {
    Summary: {
      MaxHrBpm: Option<number>;
      AvgHrvRmssd: Option<number>;
      MinHrBpm: Option<number>;
      UserMaxHrBpm: Option<number>;
      AvgHrvSdnn: Option<number>;
      AvgHrBpm: Option<number>;
    };
    Detailed: {
      HrSamples: Array<HeartRateDataSample>;
    };
  };
  TemperatureData?: {
    Delta: Option<number>;
  };
  ReadinessData?: {
    Readiness: Option<number>;
  };
  RespirationData?: {
    BreathsData: {
      MinBreathsPerMin: Option<number>;
      AvgBreathsPerMin: Option<number>;
      MaxBreathsPerMin: Option<number>;
      OnDemandReading: Option<boolean>;
      EndTime: Option<string>;
      Samples: Array<BreathSample>;
      StartTime: Option<string>;
    };
    SnoringData?: {
      NumSnoringEvents: Option<number>;
      TotalSnoringDurationSeconds: Option<number>;
      EndTime: Option<string>;
      Samples: Array<SnoringSample>;
      StartTime: Option<string>;
    };
    OxygenSaturationData?: {
      StartTime: Option<string>;
      EndTime: Option<string>;
      Samples: Array<OxygenSaturationSample>;
    };
  };
}

export interface BreathSample {
  TimeStamp: string;
  BreathsPerMin: number;
}

export interface SnoringSample {
  TimeStamp: string;
  DurationSeconds: number;
}

export interface OxygenSaturationSample {
  TimeStamp: string;
  Percentage: number;
}

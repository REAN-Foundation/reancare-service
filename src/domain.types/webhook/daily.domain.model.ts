import { OxygenSaturationSample } from './body.domain.model';
import { EventStatus, EventType, Option, TerraUser } from './webhook.event';

export interface DailyDomainModel {
  Status : EventStatus;
  Type   : EventType;
  User   : TerraUser;
  Data   : Daily[];
}

export interface Daily {
  OxygenData: {
    SaturationSamples: Array<OxygenSaturationSample>;
    AvgSaturationPercentage: Option<number>;
    Vo2maxMlPerMinPerKg: Option<number>;
  };
  MetaData: {
    EndTime: string;
    StartTime: string;
    UploadType: UploadType;
  };
  DeviceData?: {
    Name: string;
    HardwareVersion: string;
    Manufacturer: string;
    SoftwareVersion: string;
    ActivationTimestamp: string;
    SerialNumber: string;
  };
  DistanceData: {
    Swimming: {
      NumStrokes: Option<number>;
      NumLaps: Option<number>;
      PoolLengthMeters: Option<number>;
    };
    FloorsClimbed: Option<number>;
    Elevation: {
      LossActualMeters: Option<number>;
      MinMeters: Option<number>;
      AvgMeters: Option<number>;
      GainActualMeters: Option<number>;
      MaxMeters: Option<number>;
      GainPlannedMeters: Option<number>;
    };
    Steps: Option<number>;
    Detailed?: {
      StepSamples: Array<StepSample>;
    };
    DistanceMeters: Option<number>;
  };
  METData: {
    NumLowIntensityMinutes: Option<number>;
    NumLighIntensityMinutes: Option<number>;
    NumInactiveMinutes: Option<number>;
    NumModerateIntensityMinutes: Option<number>;
    AvgLevel: Option<number>;
  };
  CaloriesData: {
    NetIntakeCalories: Option<number>;
    BMRCalories: Option<number>;
    TotalBurnedCalories: Option<number>;
    NetActivityCalories: Option<number>;
  };
  HeartRateData: {
    Summary: {
      MaxHrBpm: Option<number>;
      RestingHrBpm: Option<number>;
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
  ActiveDurationsData: {
    ActivitySeconds: number;
    RestSeconds?: number;
    ActivityLevelsSamples: Array<ActivityLevelSample>;
    LowIntensitySeconds?: number;
    VigorousIntensitySeconds?: number;
    NumContinuousInactivePeriods?: number;
    InactivitySeconds?: number;
    ModerateIntensitySeconds?: number;
  };
  StressData: {
    RestStressDurationSeconds: Option<number>;
    StressDurationSeconds: Option<number>;
    ActivityStressDurationSeconds: Option<number>;
    AvgStressLevel: Option<number>;
    LowStressDurationSeconds: Option<number>;
    MediumStressDurationSeconds: Option<number>;
    Samples: Array<StressSample>;
    HighStressDurationSeconds: Option<number>;
    MaxStressLevel: Option<number>;
  };
}

export interface StepSample {
  TimeStamp: string;
  Steps: number;
  TimerDurationSeconds: number;
}

export interface HeartRateDataSample {
  TimeStamp: string;
  BPM: number;
}

export interface ActivityLevelSample {
  TimeStamp: string;
  Level: ActivityLevel;
}

export interface StressSample {
  TimeStamp: string;
  Level: number;
}

export enum ActivityLevel {
  UNKNOWN = 0,
  REST = 1,
  INACTIVE = 2,
  LOW_INTENSITY = 3,
  MEDIUM_INTENSITY = 4,
  HIGH_INTENSITY = 5,
}

export enum UploadType {
  UNKNOWN = 0,
  AUTOMATIC = 1,
  MANUAL = 2,
  UPDATE = 3,
}

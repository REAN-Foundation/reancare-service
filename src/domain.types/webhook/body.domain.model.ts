import { EventStatus, EventType, Option, TerraUser } from './webhook.event';

export interface BodyDomainModel {
  Status : EventStatus;
  Type   : EventType;
  User   : TerraUser;
  Data   : Body[];
}

export interface Body {
  OxygenData: {
    SaturationSamples: Array<OxygenSaturationSample>;
    AvgSaturationPercentage?: Option<number>;
    Vo2maxMlPerMinPerKg?: Option<number>;
  };
  MetaData: {
    EndTime: string;
    StartTime: string;
  };
  HydrationData?: {
    DayTotalWaterConsumptionMl: Option<number>;
  };
  DeviceData?: {
    Name: Option<string>;
    HardwareVersion: Option<string>;
    Manufacturer: Option<string>;
    SoftwareVersion: Option<string>;
    ActivationTimestamp: Option<string>;
    SerialNumber: Option<string>;
  };
  BloodPressureData: {
    BloodPressureSamples: Array<BloodPressureSample>;
  };
  TemperatureData: {
    BodyTemperatureSamples: Array<TemperatureSample>;
    AmbientTemperatureSamples?: Array<TemperatureSample>;
    SkinTemperaturSamples?: Array<TemperatureSample>;
  };
  MeasurementsData: {
    Measurements: Array<MeasurementDataSample>;
  };
  HeartData: {
    AfibClassificationSamples: Array<AFibClassificationSample>;
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
          HrSamples: Array<HeartRateDataSample>,
    }
    };
    PulseWaveVelocitySamples: Array<PulseVelocitySample>;
  };
  GlucoseData: {
    BloodGlucoseSamples: Array<GlucoseDataSample>;
    DayAvgBloodGlucoseMgPerDL?: Option<number>;
  };
}

export interface GlucoseDataSample {
  TimeStamp: string;
  BloodGlucoseMgPerDL: number;
  GlucoseLevelFlag: number;
  TrendArrow: number;
}

export interface OxygenSaturationSample {
  TimeStamp: string;
  Percentage: number;
}

export interface BloodPressureSample {
  TimeStamp: string;
  DiastolicBPmmHg: number;
  SystolicBPmmHg: number;
}

export interface TemperatureSample {
  TimeStamp: string;
  TemperatureCelsius: number;
}

export interface MeasurementDataSample {
  MeasurementTime?: string;
  BMI?: Option<number>;
  BMR?: Option<number>;
  RMR?: Option<number>;
  EstimatedFitnessAge?: Option<number>;
  SkinFoldMm?: Option<number>;
  BodyfatPercentage?: Option<number>;
  WeightKg: Option<number>;
  HeightCm: Option<number>;
  BoneMassKg?: Option<number>;
  MuscleMassKg?: Option<number>;
  LeanMassKg?: Option<number>;
  WaterPercentage?: Option<number>;
  InsulinUnits?: Option<number>;
  InsulinType?: Option<string>;
  UrineColor?: Option<string>;
}

export interface AFibClassificationSample {
  TimeStamp: string;
  AFibClassification: number;
}

export interface PulseVelocitySample {
  TimeStamp: string;
  PulseWaveVelocityMetersPerSecond: number;
}

export interface HeartRateDataSample {
  TimeStamp: string;
  BPM: number;
}


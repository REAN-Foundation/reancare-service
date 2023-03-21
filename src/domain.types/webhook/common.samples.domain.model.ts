import { Option } from './webhook.event';

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
    MeasurementTime: string;
    BMI: Option<number>;
    BMR: Option<number>;
    RMR: Option<number>;
    EstimatedFitnessAge: Option<number>;
    SkinFoldMm: Option<number>;
    BodyfatPercentage: Option<number>;
    WeightKg: Option<number>;
    HeightCm: Option<number>;
    BoneMassKg: Option<number>;
    MuscleMassKg: Option<number>;
    LeanMassKg: Option<number>;
    WaterPercentage: Option<number>;
    InsulinUnits: Option<number>;
    InsulinType: Option<string>;
    UrineColor: Option<string>;
  }

export interface AFibClassificationSample {
    TimeStamp: string;
    AFibClassification: number;
  }

export interface PulseVelocitySample {
    TimeStamp: string;
    PulseWaveVelocityMetersPerSecond: number;
  }

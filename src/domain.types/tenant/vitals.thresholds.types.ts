import { Severity } from '../clinical/biometrics/biometrics.types';

export interface RangeDefinition {
    Min?: number;
    Max?: number;
}

export interface ThresholdCategory {
    Category     : string;
    Severity     : Severity;
    Ranges       : { [measurementName: string]: RangeDefinition };
    AlertMessage : { [languageCode: string]: string };
    SendAlert    : boolean;
    Priority     : number;
}

export interface VitalThresholdConfig {
    Enabled    : boolean;
    Unit       : string;
    Categories : ThresholdCategory[];
}

export interface VitalsThresholds {
    BloodPressure?        : VitalThresholdConfig;
    Pulse?                : VitalThresholdConfig;
    BloodGlucose?         : VitalThresholdConfig;
    BodyTemperature?      : VitalThresholdConfig;
    BloodOxygenSaturation?: VitalThresholdConfig;
    BodyBmi?              : VitalThresholdConfig;
}

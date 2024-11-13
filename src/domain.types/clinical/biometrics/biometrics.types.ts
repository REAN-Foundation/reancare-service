import { BloodCholesterolSearchFilters } from "./blood.cholesterol/blood.cholesterol.search.types";
import { BloodGlucoseSearchFilters } from "./blood.glucose/blood.glucose.search.types";
import { BloodOxygenSaturationSearchFilters } from "./blood.oxygen.saturation/blood.oxygen.saturation.search.types";
import { BloodPressureSearchFilters } from "./blood.pressure/blood.pressure.search.types";
import { BodyHeightSearchFilters } from "./body.height/body.height.search.types";
import { BodyTemperatureSearchFilters } from "./body.temperature/body.temperature.search.types";
import { BodyWeightSearchFilters } from "./body.weight/body.weight.search.types";
import { PulseSearchFilters } from "./pulse/pulse.search.types";

export enum BiometricsType {
    BloodGlucose          = 'Blood Glucose',
    BloodOxygenSaturation = 'Blood Oxygen Saturation',
    BloodPressure         = 'Blood Pressure',
    BodyHeight            = 'Body Height',
    BodyWeight            = 'Body Weight',
    BodyTemperature       = 'Body Temperature',
    Pulse                 = 'Pulse',
}

export enum BiometricAlertType {
    BloodGlucoseAlert          = 'BloodGlucoseAlert',
    BloodOxygenSaturationAlert = 'BloodOxygenSaturationAlert',
    BloodPressureAlert         = 'BloodPressureAlert',
    BodyBmiAlert               = 'BodyBmiAlert',
    BodyTemperatureAlert       = 'BodyTemperatureAlert',
    PulseAlert                 = 'PulseAlert',
}

export const BiometricsTypeList: BiometricsType[] = [
    BiometricsType.BloodGlucose,
    BiometricsType.BloodOxygenSaturation,
    BiometricsType.BloodPressure,
    BiometricsType.BodyHeight,
    BiometricsType.BodyWeight,
    BiometricsType.BodyTemperature,
    BiometricsType.Pulse,
];

export type BiometricSearchFilters = BloodCholesterolSearchFilters
    | BloodGlucoseSearchFilters
    | BloodOxygenSaturationSearchFilters
    | BloodPressureSearchFilters
    | BodyHeightSearchFilters
    | BodyWeightSearchFilters
    | BodyTemperatureSearchFilters
    | PulseSearchFilters;
    
export enum Severity {
    LOW = "Low",
    NORMAL = "Normal",
    ELEVATED = "Elevated",
    HYPERTENSION_STAGE1 = "Hypertension_stage1",
    HYPERTENSION_STAGE2 = "Hypertension_stage2",
    HYPERTENSIVE_CRISIS = "Hypertensive_crisis",
    HIGH = "High",
    VERY_HIGH = "Very High"
    }

export interface AlertNotification {
        severity: Severity;
        range: string;
        message: string;
    }

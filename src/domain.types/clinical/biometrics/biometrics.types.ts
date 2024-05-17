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
    
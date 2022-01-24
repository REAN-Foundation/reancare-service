import { uuid } from "../../miscellaneous/system.types";
import { BiometricsType } from "../biometrics/biometrics.types";
import { BloodGlucoseDto } from "../biometrics/blood.glucose/blood.glucose.dto";
import { BloodOxygenSaturationDto } from "../biometrics/blood.oxygen.saturation/blood.oxygen.saturation.dto";
import { BloodPressureDto } from "../biometrics/blood.pressure/blood.pressure.dto";
import { BodyHeightDto } from "../biometrics/body.height/body.height.dto";
import { BodyTemperatureDto } from "../biometrics/body.temperature/body.temperature.dto";
import { BodyWeightDto } from "../biometrics/body.weight/body.weight.dto";
import { PulseDto } from "../biometrics/pulse/pulse.dto";
import { QueryResponseType, SAssessmentQueryOption } from "./assessment.types";

export interface BaseQueryAnswer {
    AssessmentId    : uuid;
    NodeId?         : uuid;
    NodeDisplayCode?: string;
    Title?          : string;
    ResponseType    : QueryResponseType;
}

export interface SingleChoiceQueryAnswer extends BaseQueryAnswer {
    ChosenSequence         : number;
    ChosenOption?          : SAssessmentQueryOption;
}

export interface MultipleChoiceQueryAnswer extends BaseQueryAnswer {
    ChosenSequences         : number[];
    ChosenOptions?          : SAssessmentQueryOption[];
}

export interface MessageAnswer extends BaseQueryAnswer {
    Achnowledged : boolean;
}

export interface TextQueryAnswer extends BaseQueryAnswer {
    Text : string;
}

export interface IntegerQueryAnswer extends BaseQueryAnswer {
    Field? : string;
    Value  : number;
}

export interface FloatQueryAnswer extends BaseQueryAnswer {
    Field? : string;
    Value  : number;
}

export interface BiometricsEntry {
    BiometricsType: BiometricsType;
    Value         :
        | BloodGlucoseDto
        | BloodOxygenSaturationDto
        | BloodPressureDto
        | BodyWeightDto
        | BodyHeightDto
        | BodyTemperatureDto
        | PulseDto;
}

export interface BiometricQueryAnswer extends BaseQueryAnswer {
    Values  : BiometricsEntry[];
}

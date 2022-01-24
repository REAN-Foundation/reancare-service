import { uuid } from "../../miscellaneous/system.types";
import { AssessmentBiometrics, QueryResponseType } from "./assessment.types";

export interface AssessmentAnswerDomainModel {
    QuestionNodeId  : uuid;
    AssessmentId?   : uuid;
    ResponseType    : QueryResponseType;
    IsBiometric?    : boolean;
    IntegerValue?   : number;
    FloatValue?     : number;
    TextValue?      : string;
    FloatArray?     : number[];
    IntegerArray?   : number[];
    ObjectArray?    : any[];
    BiometricsArray?: AssessmentBiometrics[];
}

import { uuid } from "../../miscellaneous/system.types";
import { AssessmentBiometrics, QueryResponseType } from "./assessment.types";

export interface AssessmentAnswerDomainModel {
    QuestionNodeId  : uuid;
    AssessmentId?   : uuid;
    ResponseType    : QueryResponseType;
    IntegerValue?   : number;
    FloatValue?     : number;
    BooleanValue?   : boolean;
    TextValue?      : string;
    FloatArray?     : number[];
    IntegerArray?   : number[];
    ObjectArray?    : any[];
    Biometrics?     : AssessmentBiometrics[];
}

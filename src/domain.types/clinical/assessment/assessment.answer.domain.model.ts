import { uuid } from "../../miscellaneous/system.types";
import { AssessmentBiometrics, QueryResponseType } from "./assessment.types";

export interface AssessmentAnswerDomainModel {
    QuestionNodeId  : uuid;
    FieldName?      : string;
    AssessmentId?   : uuid;
    ResponseType    : QueryResponseType;
    IntegerValue?   : number;
    FloatValue?     : number;
    BooleanValue?   : boolean;
    TextValue?      : string;
    DateValue?      : Date;
    FloatArray?     : number[];
    IntegerArray?   : number[];
    ObjectArray?    : any[];
    Biometrics?     : AssessmentBiometrics[];
    Url?            : string;
    ResourceId?     : uuid;
}

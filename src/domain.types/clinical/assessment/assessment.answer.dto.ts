import { uuid } from "../../miscellaneous/system.types";
import { QueryResponseType } from "./assessment.types";

export interface AssessmentAnswerDto {
    QuestionNodeId         : uuid;
    QuestionNodeDisplayCode: string;
    QuestionTitle          : string;
    DisplayCode            : string;
    PatientUserId          : uuid;
    AssessmentId?          : uuid;
    ResponseType           : QueryResponseType;
    IntegerValue           : number;
    FloatValue             : number;
    TextValue              : string;
    ArrayValue             : number[];
}

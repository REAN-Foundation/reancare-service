import { uuid } from "../../miscellaneous/system.types";
import { AssessmentNodeType, QueryResponseType, CAssessmentQueryOption } from "./assessment.types";

export interface AssessmentQueryDto {
    id                  : uuid;
    NodeType            : AssessmentNodeType;
    ExpectedResponseType: QueryResponseType;
    DisplayCode         : string;
    PatientUserId       : uuid;
    AssessmentTemplateId: uuid;
    ParentNodeId?       : uuid;
    AssessmentId?       : uuid;
    Sequence?           : number;
    Title?              : string;
    Description?        : string;
    RawData?            : string;
    Message?            : string;
    Options             : CAssessmentQueryOption[];
    CorrectAnswer?     : string | any;
    ProviderGivenCode?  : string;
    ProviderGivenId?    : string;
}

export interface AssessmentQueryListDto {
    id                         : uuid;
    NodeType                   : AssessmentNodeType;
    ServeListNodeChildrenAtOnce: boolean;
    DisplayCode                : string;
    PatientUserId              : uuid;
    AssessmentTemplateId       : uuid;
    ParentNodeId?              : uuid;
    AssessmentId?              : uuid;
    Sequence?                  : number;
    Title?                     : string;
    Description?               : string;
    ChildrenQuestions          : AssessmentQueryDto[];
    ProviderGivenCode?         : string;
    ProviderGivenId?           : string;
    CorrectAnswer?             : string | any;
}

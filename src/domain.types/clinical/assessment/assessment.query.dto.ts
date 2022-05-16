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
    Message?            : string;
    Options             : CAssessmentQueryOption[];
    ProviderGivenCode?  : string;
    ProviderGivenId?    : string;
}

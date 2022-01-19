import { uuid } from "../../miscellaneous/system.types";
import { AssessmentNodeType, QueryResponseType, SAssessmentQueryOption } from "./assessment.types";

export interface AssessmentQuestionDto {
    NodeId                  : uuid;
    DisplayCode         : string;
    PatientUserId       : uuid;
    AssessmentTemplateId: uuid;
    ParentNodeId?       : uuid;
    AssessmentId?       : uuid;
    Sequence?           : number;
    NodeType            : AssessmentNodeType;
    Title?              : string;
    Description?        : string;
    QueryResponseType   : QueryResponseType;
    Options             : SAssessmentQueryOption[];
    ProviderGivenCode   : string;
}

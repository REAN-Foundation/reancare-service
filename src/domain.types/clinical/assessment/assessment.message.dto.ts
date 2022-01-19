import { uuid } from "../../miscellaneous/system.types";
import { AssessmentNodeType } from "./assessment.types";

export interface AssessmentMessageDto {
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
    Message?            : string;
    Acknowledged        : boolean;
    ProviderGivenCode   : string;
}

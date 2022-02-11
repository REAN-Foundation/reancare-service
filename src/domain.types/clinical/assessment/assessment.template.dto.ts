import { UUID } from "aws-sdk/clients/inspector";
import { uuid } from "../../miscellaneous/system.types";
import { AssessmentType } from "./assessment.types";

export interface AssessmentTemplateDto {
    id?                    : uuid;
    DisplayCode?           : string;
    Type                   : AssessmentType;
    Title                  : string;
    Description?           : string;
    ProviderAssessmentCode?: string;
    Provider?              : string;
    RootNodeId?            : UUID;
}

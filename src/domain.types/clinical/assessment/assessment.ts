import { AssessmentNode } from "./assessment.node";
import { ProgressStatus, uuid } from "../../miscellaneous/system.types";
import { AssessmentType } from "./assessment.types";

export interface Assessment {
    id?                    : uuid;
    DisplayCode?           : string;
    Title                  : string;
    Type                   : AssessmentType;
    PatientUserId          : uuid;
    AssessmentTemplateId   : uuid;
    ProviderEnrollmentId?  : string;
    ProviderAssessmentCode?: string;
    Provider?              : string;
    Status?                : ProgressStatus;
    StartedAt?             : Date;
    FinishedAt?            : Date;

    AssessmentNodes         : AssessmentNode[];
}

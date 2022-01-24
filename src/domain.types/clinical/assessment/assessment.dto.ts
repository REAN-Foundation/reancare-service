import { ProgressStatus, uuid } from "../../miscellaneous/system.types";
import { AssessmentType } from "./assessment.types";

export interface AssessmentDto {
    id                     : uuid;
    DisplayCode            : string;
    Title                  : string;
    Description            : string;
    Type                   : AssessmentType;
    PatientUserId          : uuid;
    AssessmentTemplateId   : uuid;
    ProviderEnrollmentId?  : string;
    ProviderAssessmentCode?: string;
    Provider?              : string;
    Status                 : ProgressStatus;
    ParentActivityId?      : uuid;
    UserTaskId?            : uuid;
    CurrentNodeId?         : uuid;
    StartedAt?             : Date;
    FinishedAt?            : Date;
    CreatedAt              : Date;
}

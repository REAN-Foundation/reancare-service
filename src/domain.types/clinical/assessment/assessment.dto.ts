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
    ScoringApplicable?     : boolean;
    ScoreDetails?          : any;
    ProviderEnrollmentId?  : string;
    ProviderAssessmentCode?: string;
    ProviderAssessmentId?  : string;
    Provider?              : string;
    Status                 : ProgressStatus;
    ParentActivityId?      : uuid;
    UserTaskId?            : uuid;
    ReportUrl?             : string;
    CurrentNodeId?         : uuid;
    ScheduledAt?           : Date;
    StartedAt?             : Date;
    FinishedAt?            : Date;
    CreatedAt              : Date;
    UserResponses?         : any[];
    TotalNumberOfQuestions?: number;
}

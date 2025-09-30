import { ProgressStatus, uuid } from "../../miscellaneous/system.types";
import { AssessmentType } from "./assessment.types";

export interface AssessmentDomainModel {
    id?                    : uuid;
    DisplayCode?           : string;
    Title?                 : string;
    Description?           : string;
    Type?                  : AssessmentType;
    PatientUserId?         : uuid;
    AssessmentTemplateId?  : uuid;
    ScoringApplicable?     : boolean;
    ScoreDetails?          : string;
    Provider?              : string;
    ProviderEnrollmentId?  : string | number;
    ProviderAssessmentCode?: string;
    ProviderAssessmentId?  : string;
    CurrentNodeId?         : uuid;
    ReportUrl?             : string;
    Status?                : ProgressStatus;
    StartedAt?             : Date;
    FinishedAt?            : Date;
    ParentActivityId?      : uuid;
    UserTaskId?            : uuid;
    ScheduledDateString?   : uuid;
    TotalNumberOfQuestions?: number;
}

export interface AssessmentSubmissionDomainModel {
    PatientUserId? : uuid;
    AssessmentTemplateId? : uuid;
    AssessmentTemplateTitle? : string;
    ClientName? : string;
    TenantId? : string;
    ScoringApplicable? : boolean;
    ProviderEnrollmentId? : string;
    ProviderAssessmentCode? : string;
    Provider? : string;
    FlowToken? : string;
    Answers? : Record<string, any>;
}

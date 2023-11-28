import { UserTaskCategory } from "../../domain.types/users/user.task/user.task.types";
import { uuid } from "../../domain.types/miscellaneous/system.types";

export interface EHRCareplanActivityDomainModel {
    AppName?        : string;
    PatientUserId?  : uuid;
    RecordId?       : uuid;
    EnrollmentId    : number | string;
    Provider        : string;
    PlanName        : string;
    PlanCode        : string;
    Type            : string;
    Category        : UserTaskCategory | string;
    ProviderActionId: string;
    Title           : string;
    Description     : string;
    Transcription?  : string;
    Url             : string;
    Language        : string;
    ScheduledAt     : Date;
    CompletedAt     : Date;
    Sequence        : number;
    ScheduledDay    : number;
    Status          : string;
    TimeStamp?      : Date;
    AdditionalInfo? : string;
    HealthSystem?   : string;
    AssociatedHospital? : string;
    RecordDate?     : Date;
}

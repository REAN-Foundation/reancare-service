import { UserTaskCategory } from "../../../../domain.types/users/user.task/user.task.types";
import { uuid } from "../../../miscellaneous/system.types";

export interface CareplanActivityDomainModel {
    PatientUserId    : uuid;
    EhrId?           : uuid;
    EnrollmentId     : number | string;
    ParticipantId    : number | string;
    Provider         : string;
    PlanName         : string;
    PlanCode         : string;
    Type             : string;
    Category         : UserTaskCategory;
    ProviderActionId : string;
    Title            : string;
    Description      : string;
    Transcription?   : string;
    Url              : string;
    Language         : string;
    ScheduledAt      : Date;
    Sequence         : number;
    Frequency        : number;
    Status           : string;
}

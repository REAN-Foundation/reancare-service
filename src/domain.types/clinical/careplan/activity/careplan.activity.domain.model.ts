import { UserTaskCategory } from "../../../../domain.types/user/user.task/user.task.types";
import { uuid } from "../../../miscellaneous/system.types";

export interface CareplanActivityDomainModel {
    PatientUserId   : uuid;
    EnrollmentId    : string;
    ParticipantId   : string;
    Provider        : string;
    PlanName        : string;
    PlanCode        : string;
    Type            : string;
    Category        : UserTaskCategory;
    ProviderActionId: string;
    Title           : string;
    Description     : string;
    Url             : string;
    Language        : string;
    ScheduledAt     : Date;
    Sequence        : number;
    Frequency       : number;
    Status          : string;
}

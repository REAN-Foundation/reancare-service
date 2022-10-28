import { UserTaskCategory } from "../../../users/user.task/user.task.types";
import { uuid } from "../../../miscellaneous/system.types";

export interface CareplanActivity {
    id?                     : uuid;
    PatientUserId?          : uuid;
    ProviderActionId        : string;
    EnrollmentId?           : number | string;
    UserTaskId?             : uuid;
    Provider                : string;
    ParticipantId?          : number | string;
    PlanName?               : string;
    PlanCode?               : string;
    Type?                   : string;
    Category?               : UserTaskCategory;
    Title?                  : string;
    Description?            : string;
    Transcription?          : string;
    Url?                    : string;
    Language?               : string;
    ScheduledAt?            : Date;
    TimeSlot?               : string;
    CompletedAt?            : Date;
    Sequence?               : number;
    Frequency?              : number;
    Status?                 : string;
    Comments?               : string;
    RawContent?             : any;
    IsRegistrationActivity? : boolean;
}

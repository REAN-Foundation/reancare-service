import { uuid } from "../../../miscellaneous/system.types";

/////////////////////////////////////////////////////////////////////////////////////////////

export interface ActivityTrackerDto {
    id?                           : uuid;
    PatientUserId?                : uuid;
    LastLoginDate?                : Date;
    LastVitalUpdateDate?          : Date;
    UpdatedVitalDetails           : string;
    LastUserTaskDate?             : Date;
    UserTaskDetails?              : string;
    LastActivityDate?             : Date;
    CreatedAt?                    : Date;
    UpdatedAt?                    : Date;
}

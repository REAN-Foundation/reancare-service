import { uuid } from "../../../miscellaneous/system.types";

/////////////////////////////////////////////////////////////////////////////////////////////

export interface ActivityTrackerDto {
    id?                             : uuid;
    RecentActivityDate?             : Date;
}

export interface MostRecentActivityDto {
    PatientUserId?: uuid;
    RecentActivityDate? : Date;
}

import { uuid } from '../../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

//#region Domain models

export interface ActivityTrackerDomainModel {
    id?                           : uuid;
    PatientUserId?                : uuid;
    LastLoginDate?                : Date;
    LastVitalUpdateDate?          : Date;
    UpdatedVitalDetails?          : string;
    LastUserTaskDate?             : Date;
    UserTaskDetails?              : string;
    LastActivityDate?             : Date;
}

//#endregion

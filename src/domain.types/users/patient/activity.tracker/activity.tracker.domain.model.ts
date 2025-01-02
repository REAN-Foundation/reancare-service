import { uuid } from '../../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

//#region Domain models

export interface ActivityTrackerDomainModel {
    PatientUserId?                  : uuid;
    RecentActivityDate?             : Date;
}

//#endregion

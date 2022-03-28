//#region Domain models

export interface DoctorVisitDomainModel {
    PatientUserId? : string;
    DoctorUserId?  : string;
    DoctorEhrId?   : string;
    PastVisitId?   : string;
    PastVisitEhrId?: string;
    StartDate?     : Date;
    EndDate?       : Date;
    CreatedByUser? : string;
    EhrId?         : string;
 }

//#endregion

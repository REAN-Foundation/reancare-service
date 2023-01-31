//#region Domain models

export interface DoctorVisitDomainModel {
    PatientUserId?   : string;
    RecordedByUserId?: string;
    RecordedByEhrId? : string;
    PastVisitId?     : string;
    PastVisitEhrId?  : string;
    StartDate?       : Date;
    EndDate?         : Date;
    CreatedByUser?   : string;
    EhrId?           : string;
 }

//#endregion

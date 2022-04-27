//#region Domain models

export interface BloodSugarDomainModel {
    id?: string;
    PatientUserId?: string;
    PatientEhrId?: string;
    VisitId?: string;
    VisitEhrId?: string;
    Unit?: string;
    RecordedBy?: string;
    RecordedByEhrId?: string;
    RecordDate?:Date;
    BloodGlucose?: number;
    }

//#endregion

export interface BloodSugarSearchFilters {
    PatientUserId: string,
    VisitId: string;
    RecordDate: string;
}

//#region Domain models

export interface BloodPressureDomainModel {
    id?: string;
    PatientUserId?: string;
    PatientEhrId?: string;
    VisitId?: string;
    VisitEhrId?: string;
    Unit?: string;
    RecordedBy?: string;
    RecordedByEhrId?: string;
    RecordDate?:Date;
    BloodPressureSystolic?: number;
    BloodPressureDiastolic?: number;
    }

//#endregion

export interface BloodPressureSearchFilters {
    PatientUserId: string,
    VisitId: string;
    RecordDate: string;
}

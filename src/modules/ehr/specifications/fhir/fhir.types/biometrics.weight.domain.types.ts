//#region Domain models

export interface BiometricsWeightDomainModel {
    id?: string;
    PatientUserId?: string;
    EhrId?: string;
    VisitId?: string;
    VisitEhrId?: string;
    Unit?: string;
    RecordedBy?: string;
    RecordedByEhrId?: string;
    RecordDate?:Date;
    BodyWeight?: number;
    }

//#endregion

export interface BiometricsWeightSearchFilters {
    PatientUserId: string,
    VisitId: string;
    RecordDate: string;
}

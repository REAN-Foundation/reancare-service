//#region Domain models

export interface PulseDomainModel {
    id?: string;
    PatientUserId?: string;
    PatientEhrId?: string;
    VisitId?: string;
    VisitEhrId?: string;
    Unit?: string;
    RecordedBy?: string;
    RecordedByEhrId?: string;
    RecordDate?: Date;
    Pulse?: number;
}

//#endregion

export interface PulseSearchFilters {
    PatientUserId: string,
    VisitId: string;
    RecordDate: string;
}

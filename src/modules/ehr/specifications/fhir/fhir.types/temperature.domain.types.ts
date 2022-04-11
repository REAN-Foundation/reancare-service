//#region Domain models

export interface TemperatureDomainModel {
    id?: string;
    PatientUserId?: string;
    PatientEhrId?: string;
    VisitId?: string;
    VisitEhrId?: string;
    Unit?: string;
    RecordedBy?: string;
    RecordedByEhrId?: string;
    RecordDate?: Date;
    Temperature?: number;
    }

//#endregion

export interface TemperatureSearchFilters {
    PatientUserId: string,
    VisitId: string;
    RecordDate: string;
}

import { DoctorNoteDto } from "./doctor.note.dto";

//////////////////////////////////////////////////////////////////////

export interface DoctorNoteSearchFilters {
    PatientUserId?: string;
    MedicalPractitionerUserId?: string;
    VisitId?: string;
    Notes?: string;
    RecordDateFrom: Date;
    RecordDateTo: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface DoctorNoteSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: DoctorNoteDto[];
}

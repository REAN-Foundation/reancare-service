import { DoctorNoteDto } from "./doctor.note.dto";
import { BaseSearchFilters, BaseSearchResults } from "../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";

//////////////////////////////////////////////////////////////////////

export interface DoctorNoteSearchFilters extends BaseSearchFilters{
    PatientUserId?            : uuid;
    MedicalPractitionerUserId?: uuid;
    VisitId?                  : uuid;
    Notes?                    : string;
    RecordDateFrom            : Date;
    RecordDateTo              : Date;
}

export interface DoctorNoteSearchResults extends BaseSearchResults{
    Items : DoctorNoteDto[];
}

import { DoctorNoteDomainModel } from "../../../domain.types/clinical/doctor.note/doctor.note.domain.model";
import { DoctorNoteDto } from "../../../domain.types/clinical/doctor.note/doctor.note.dto";
import { DoctorNoteSearchFilters, DoctorNoteSearchResults } from "../../../domain.types/clinical/doctor.note/doctor.note.search.types";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IDoctorNoteRepo {

    create(doctorNoteDomainModel: DoctorNoteDomainModel): Promise<DoctorNoteDto>;

    getById(id: string): Promise<DoctorNoteDto>;

    search(filters: DoctorNoteSearchFilters): Promise<DoctorNoteSearchResults>;

    update(id: string, doctorNoteDomainModel: DoctorNoteDomainModel): Promise<DoctorNoteDto>;

    delete(id: string): Promise<boolean>;

}

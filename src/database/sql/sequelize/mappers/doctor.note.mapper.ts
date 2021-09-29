import DoctorNote from '../models/doctor.note.model';
import { DoctorNoteDto } from '../../../../domain.types/doctor.note/doctor.note.dto';
import { ClinicalValidationStatus } from '../../../../domain.types/miscellaneous/clinical.types';

///////////////////////////////////////////////////////////////////////////////////

export class DoctorNoteMapper {

    static toDto = (doctorNote: DoctorNote): DoctorNoteDto => {
        if (doctorNote == null){
            return null;
        }

        const dto: DoctorNoteDto = {
            id                        : doctorNote.id,
            PatientUserId             : doctorNote.PatientUserId,
            EhrId                     : doctorNote.EhrId,
            MedicalPractitionerUserId : doctorNote.MedicalPractitionerUserId,
            VisitId                   : doctorNote.VisitId,
            Notes                     : doctorNote.Notes,
            ValidationStatus          : doctorNote.ValidationStatus as ClinicalValidationStatus,
            RecordDate                : doctorNote.RecordDate,
        };
        return dto;
    }

}

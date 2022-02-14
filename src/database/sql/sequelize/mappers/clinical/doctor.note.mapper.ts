import { DoctorNoteDto } from '../../../../../domain.types/clinical/doctor.note/doctor.note.dto';
import { ClinicalValidationStatus } from '../../../../../domain.types/miscellaneous/clinical.types';
import DoctorNote from '../../models/clinical/doctor.note.model';

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
            ValidationStatus          : ClinicalValidationStatus[doctorNote.ValidationStatus],
            RecordDate                : doctorNote.RecordDate,
        };
        return dto;
    };

}

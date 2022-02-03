import Complaint from '../../models/clinical/complaint.model';
import { ComplaintDto } from '../../../../../domain.types/clinical/complaint/complaint.dto';
import { Severity } from '../../../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////

export class ComplaintMapper {

    static toDto = (complaint: Complaint): ComplaintDto => {
        if (complaint == null){
            return null;
        }

        const dto: ComplaintDto = {
            id                        : complaint.id,
            PatientUserId             : complaint.PatientUserId,
            MedicalPractitionerUserId : complaint.MedicalPractitionerUserId,
            VisitId                   : complaint.VisitId,
            EhrId                     : complaint.EhrId,
            Complaint                 : complaint.Complaint,
            Severity                  : complaint.Severity as Severity,
            RecordDate                : complaint.RecordDate
        };
        return dto;
    };

}

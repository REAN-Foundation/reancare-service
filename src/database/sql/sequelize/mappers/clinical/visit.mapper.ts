import Visit from '../../models/clinical/visit.model';
import { VisitDto } from '../../../../../domain.types/clinical/visit/visit.dto';

///////////////////////////////////////////////////////////////////////////////////

export class VisitMapper {

    static toDto = (visit: Visit): VisitDto => {
        if (visit == null) {
            return null;
        }

        const dto: VisitDto = {
            id                        : visit.id,
            VisitType                 : visit.VisitType,
            EhrId                     : visit.EhrId,
            DisplayId                 : visit.DisplayId,
            PatientUserId             : visit.PatientUserId,
            MedicalPractitionerUserId : visit.MedicalPractitionerUserId,
            ReferenceVisitId          : visit.ReferenceVisitId,
            CurrentState              : visit.CurrentState,
            StartDate                 : visit.StartDate,
            EndDate                   : visit.EndDate,
            FulfilledAtOrganizationId : visit.FulfilledAtOrganizationId,
            AdditionalInformation     : visit.AdditionalInformation,
        };
        return dto;
    };

}

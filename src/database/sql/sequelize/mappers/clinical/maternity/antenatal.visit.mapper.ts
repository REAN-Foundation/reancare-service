import { AntenatalVisitDto } from '../../../../../../domain.types/clinical/maternity/antenatal.visit/antenatal.visit.dto';
import AnteNatalVisit from '../../../models/clinical/maternity/antenatal.visit.model';

///////////////////////////////////////////////////////////////////////////////////

export class AntenatalVisitMapper {

    // 
    static toDto = (visit: AnteNatalVisit): AntenatalVisitDto => {
        if (visit == null) {
            return null;
        }

        const dto: AntenatalVisitDto = {
            id                       : visit.id,
            VisitId                  : visit.VisitId,
            PregnancyId              : visit.PregnancyId,
            PatientUserId            : visit.PatientUserId,
            DateOfVisit              : visit.DateOfVisit,
            GestationInWeeks         : visit.GestationInWeeks,
            FetalHeartRateBPM        : visit.FetalHeartRateBPM,
            FundalHeight             : visit.FundalHeight ? JSON.parse(visit.FundalHeight) : [],
            DateOfNextVisit          : visit.DateOfNextVisit,
            BodyWeightID             : visit.BodyWeightID,
            BodyTemperatureId        : visit.BodyTemperatureId,
            BloodPressureId          : visit.BloodPressureId,
        };
        return dto;
    };
}

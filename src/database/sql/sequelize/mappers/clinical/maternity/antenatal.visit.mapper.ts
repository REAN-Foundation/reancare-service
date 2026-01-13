import { VisitDto } from '../../../../../../domain.types/clinical/visit/visit.dto';
import { AntenatalVisitDto } from '../../../../../../domain.types/clinical/maternity/antenatal.visit/antenatal.visit.dto';
import AnteNatalVisit from '../../../models/clinical/maternity/antenatal.visit.model';
import PregnancyDto  from '../../../models/clinical/maternity/pregnancy.model';

///////////////////////////////////////////////////////////////////////////////////

export class AntenatalVisitMapper {
 
    static toDto = (visit: AnteNatalVisit, visitDto: VisitDto = null, pregnancyDto: PregnancyDto = null): AntenatalVisitDto => {
        if (visit == null) {
            return null;
        }

        const dto: AntenatalVisitDto = {
            id                       : visit.id,
            VisitId                  : visit.VisitId,
            Visit                    : visitDto,
            PregnancyId              : visit.PregnancyId,
            Pregnancy                : pregnancyDto,
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

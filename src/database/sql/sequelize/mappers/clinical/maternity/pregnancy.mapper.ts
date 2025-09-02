import { PregnancyDto } from '../../../../../../domain.types/clinical/maternity/pregnancy/pregnancy.dto';
import Pregnancy from '../../../models/clinical/maternity/pregnancy.model';

///////////////////////////////////////////////////////////////////////////////////

export class PregnancyMapper {
    
    static toDto = (pregnancy: Pregnancy): PregnancyDto => {
        if (pregnancy == null) {
            return null;
        }

        const dto: PregnancyDto = {
            id                           : pregnancy.id,
            PatientUserId                : pregnancy.PatientUserId,
            ExternalPregnancyId          : pregnancy.ExternalPregnancyId,
            DateOfLastMenstrualPeriod    : pregnancy.DateOfLastMenstrualPeriod,
            EstimatedDateOfChildBirth    : pregnancy.EstimatedDateOfChildBirth,
            Gravidity                    : pregnancy.Gravidity,
            Parity                       : pregnancy.Parity,
        };
        return dto;
    };

}

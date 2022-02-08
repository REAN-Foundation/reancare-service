import Allergy from '../../models/clinical/allergy.model';
import { AllergyDto } from '../../../../../domain.types/clinical/allergy/allergy.dto';
import { AllergenCategories, AllergenExposureRoutes } from '../../../../../domain.types/clinical/allergy/allergy.types';
import { Severity } from '../../../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////

export class AllergyMapper {

    static toDto = (allergy: Allergy): AllergyDto => {
        if (allergy == null){
            return null;
        }

        const dto: AllergyDto = {
            id                    : allergy.id,
            PatientUserId         : allergy.PatientUserId,
            Allergy               : allergy.Allergy,
            AllergenCategory      : allergy.AllergenCategory as AllergenCategories,
            AllergenExposureRoute : allergy.AllergenExposureRoute as AllergenExposureRoutes,
            Severity              : allergy.Severity as Severity,
            Reaction              : allergy.Reaction,
            OtherInformation      : allergy.OtherInformation,
            LastOccurrence        : allergy.LastOccurrence,
        };
        return dto;
    };

}

import HealthProfile from '../../models/patient/health.profile.model';
import { HealthProfileDto } from '../../../../../domain.types/patient/health.profile/health.profile.dto';

///////////////////////////////////////////////////////////////////////////////////

export class HealthProfileMapper {

    static toDto = (patientHealthProfile: HealthProfile): HealthProfileDto => {

        if (patientHealthProfile == null){
            return null;
        }

        const dto: HealthProfileDto = {
            id                 : patientHealthProfile.id,
            PatientUserId      : patientHealthProfile.PatientUserId,
            BloodGroup         : patientHealthProfile.BloodGroup,
            MajorAilment       : patientHealthProfile.MajorAilment,
            OtherConditions    : patientHealthProfile.OtherConditions,
            IsDiabetic         : patientHealthProfile.IsDiabetic,
            HasHeartAilment    : patientHealthProfile.HasHeartAilment,
            MaritalStatus      : patientHealthProfile.MaritalStatus,
            Ethnicity          : patientHealthProfile.Ethnicity,
            Nationality        : patientHealthProfile.Nationality,
            Occupation         : patientHealthProfile.Occupation,
            SedentaryLifestyle : patientHealthProfile.SedentaryLifestyle,
            IsSmoker           : patientHealthProfile.IsSmoker,
            SmokingSeverity    : patientHealthProfile.SmokingSeverity,
            SmokingSince       : patientHealthProfile.SmokingSince,
            IsDrinker          : patientHealthProfile.IsDrinker,
            DrinkingSeverity   : patientHealthProfile.DrinkingSeverity,
            DrinkingSince      : patientHealthProfile.DrinkingSince,
            SubstanceAbuse     : patientHealthProfile.SubstanceAbuse,
            ProcedureHistory   : patientHealthProfile.ProcedureHistory,
            ObstetricHistory   : patientHealthProfile.ObstetricHistory,
            OtherInformation   : patientHealthProfile.OtherInformation,
        };

        return dto;
    };

}

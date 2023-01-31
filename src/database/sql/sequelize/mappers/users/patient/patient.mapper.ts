import { PatientDetailsDto, PatientDto } from "../../../../../../domain.types/users/patient/patient/patient.dto";
import Patient from '../../../models/users/patient/patient.model';

///////////////////////////////////////////////////////////////////////////////////

export class PatientMapper {

    static toDetailsDto = async (patient: Patient): Promise<PatientDetailsDto> => {

        if (patient == null){
            return null;
        }

        const dto: PatientDetailsDto = {
            id                 : patient.id,
            UserId             : patient.UserId,
            User               : null,
            DisplayId          : patient.DisplayId,
            EhrId              : patient.EhrId,
            HealthSystem       : patient.HealthSystem,
            AssociatedHospital : patient.AssociatedHospital,
            DonorAcceptance    : patient.DonorAcceptance,
            HealthProfile      : null, //PatientMedicalProfileDto;
            Insurances         : [], //PatientInsuranceDto[];
            EmergencyContacts  : [], // PatientEmergencyContactDto[];
        };
        return dto;
    };

    static toDto = async (patient: Patient): Promise<PatientDto> => {

        if (patient == null){
            return null;
        }

        const dto: PatientDto = {
            id              : patient.id,
            UserId          : patient.UserId,
            DisplayId       : patient.DisplayId,
            EhrId           : patient.EhrId,
            DonorAcceptance : patient.DonorAcceptance,
            DisplayName     : null,
            FirstName       : null,
            LastName        : null,
            UserName        : null,
            Phone           : null,
            Email           : null,
            Gender          : null,
            BirthDate       : null,
            Age             : null,
            ImageResourceId : null,
        };
        return dto;
    };

}

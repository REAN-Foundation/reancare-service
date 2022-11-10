import { PatientDonorsDto } from "../../../../../../domain.types/clinical/donation/patient.donors.dto";
import PatientDonors from "../../../models/clinical/donation/patient.donors.model";

///////////////////////////////////////////////////////////////////////////////////

export class PatientDonorsMapper {

    static toDetailsDto = async (patientDonors: PatientDonors): Promise<PatientDonorsDto> => {

        if (patientDonors == null){
            return null;
        }

        const dto: PatientDonorsDto = {
            id               : patientDonors.id,
            Name             : patientDonors.Name,
            PatientUserId    : patientDonors.PatientUserId,
            DonorUserId      : patientDonors.DonorUserId,
            DonorType        : patientDonors.DonorType,
            VolunteerUserId  : patientDonors.VolunteerUserId,
            BloodGroup       : patientDonors.BloodGroup,
            NextDonationDate : patientDonors.NextDonationDate,
            LastDonationDate : patientDonors.LastDonationDate,
            QuantityRequired : patientDonors.QuantityRequired,
            Status           : patientDonors.Status,
            DonorGender      : null,
            DonorName        : null,
            DonorPhone       : null
        };
        return dto;
    };

}

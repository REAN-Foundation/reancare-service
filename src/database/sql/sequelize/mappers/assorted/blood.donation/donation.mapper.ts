import { DonationDto } from "../../../../../../domain.types/assorted/blood.donation/donation/donation.dto";
import Donation from "../../../models/assorted/blood.donation/donation.model";

///////////////////////////////////////////////////////////////////////////////////

export class DonationMapper {

    static toDetailsDto = async (donation: Donation): Promise<DonationDto> => {

        if (donation == null){
            return null;
        }

        const dto: DonationDto = {
            id                        : donation.id,
            PatientUserId             : donation.PatientUserId,
            NetworkId                 : donation.NetworkId,
            EmergencyDonor            : donation.EmergencyDonor,
            VolunteerOfEmergencyDonor : donation.VolunteerOfEmergencyDonor,
            RequestedQuantity         : donation.RequestedQuantity,
            RequestedDate             : donation.RequestedDate,
            DonorAcceptedDate         : donation.DonorAcceptedDate,
            DonorRejectedDate         : donation.DonorRejectedDate,
            DonatedQuantity           : donation.DonatedQuantity,
            DonationDate              : donation.DonationDate,
            DonationType              : donation.DonationType
        };
        return dto;
    };

}

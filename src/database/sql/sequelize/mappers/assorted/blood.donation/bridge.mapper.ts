import { BridgeDto } from "../../../../../../domain.types/assorted/blood.donation/bridge/bridge.dto";
import PatientDonors from "../../../models/clinical/donation/patient.donors.model";

///////////////////////////////////////////////////////////////////////////////////

export class BridgeMapper {

    static toDetailsDto = async (bridge: PatientDonors): Promise<BridgeDto> => {

        if (bridge == null){
            return null;
        }

        const dto: BridgeDto = {
            id               : bridge.id,
            Name             : bridge.Name,
            PatientUserId    : bridge.PatientUserId,
            DonorUserId      : bridge.DonorUserId,
            DonorType        : bridge.DonorType,
            VolunteerUserId  : bridge.VolunteerUserId,
            BloodGroup       : bridge.BloodGroup,
            NextDonationDate : bridge.NextDonationDate,
            LastDonationDate : bridge.LastDonationDate,
            QuantityRequired : bridge.QuantityRequired,
            Status           : bridge.Status,
            DonorGender      : null,
            DonorName        : null,
            DonorPhone       : null
        };
        return dto;
    };

}

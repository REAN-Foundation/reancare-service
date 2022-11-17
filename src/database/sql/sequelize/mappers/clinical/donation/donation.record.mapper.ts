import { DonationRecordDto } from "../../../../../../domain.types/clinical/donation.record/donation.record.dto";
import DonationRecord from "../../../models/clinical/donation/donation.record.model";

///////////////////////////////////////////////////////////////////////////////////

export class DonationRecordMapper {

    static toDetailsDto = async (donationRecord: DonationRecord): Promise<DonationRecordDto> => {

        if (donationRecord == null){
            return null;
        }

        const dto: DonationRecordDto = {
            id                : donationRecord.id,
            PatientUserId     : donationRecord.PatientUserId,
            NetworkId         : donationRecord.NetworkId,
            RequestedQuantity : donationRecord.RequestedQuantity,
            RequestedDate     : donationRecord.RequestedDate,
            DonatedQuantity   : donationRecord.DonatedQuantity,
            DonationDate      : donationRecord.DonationDate,
            DonationType      : donationRecord.DonationType
        };
        return dto;
    };

}

import { DonationCommunicationDto } from "../../../../../../domain.types/assorted/blood.donation/communication/communication.dto";
import DonationCommunication from "../../../models/assorted/blood.donation/communication.model";

///////////////////////////////////////////////////////////////////////////////////

export class DonationCommunicationMapper {

    static toDetailsDto = async (donationCommunication: DonationCommunication): Promise<DonationCommunicationDto> => {

        if (donationCommunication == null){
            return null;
        }

        const dto: DonationCommunicationDto = {
            id                        : donationCommunication.id,
            PatientUserId             : donationCommunication.PatientUserId,
            DonorUserId               : donationCommunication.DonorUserId,
            VolunteerUserId           : donationCommunication.VolunteerUserId,
            DonationRecordId          : donationCommunication.DonationRecordId,
            FifthDayReminderFlag      : donationCommunication.FifthDayReminderFlag,
            DonorNoResponseFirstFlag  : donationCommunication.DonorNoResponseFirstFlag,
            DonorNoResponseSecondFlag : donationCommunication.DonorNoResponseSecondFlag,
            DonorAcceptance           : donationCommunication.DonorAcceptance,
            IsRemindersLoaded         : donationCommunication.IsRemindersLoaded
        };
        return dto;
    };

}

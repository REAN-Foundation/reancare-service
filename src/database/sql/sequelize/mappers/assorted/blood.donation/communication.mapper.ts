import { DonationCommunicationDto } from "../../../../../../domain.types/assorted/blood.donation/communication/communication.dto";
import DonationCommunication from "../../../models/clinical/donation/donation.communication.model";

///////////////////////////////////////////////////////////////////////////////////

export class DonationCommunicationMapper {

    static toDetailsDto = async (communication: DonationCommunication): Promise<DonationCommunicationDto> => {

        if (communication == null){
            return null;
        }

        const dto: DonationCommunicationDto = {
            id                        : communication.id,
            PatientUserId             : communication.PatientUserId,
            DonorUserId               : communication.DonorUserId,
            VolunteerUserId           : communication.VolunteerUserId,
            FifthDayReminderFlag      : communication.FifthDayReminderFlag,
            DonorNoResponseFirstFlag  : communication.DonorNoResponseFirstFlag,
            DonorNoResponseSecondFlag : communication.DonorNoResponseSecondFlag,
            DonorAcceptance           : communication.DonorAcceptance,
            IsRemindersLoaded         : communication.IsRemindersLoaded
        };
        return dto;
    };

}

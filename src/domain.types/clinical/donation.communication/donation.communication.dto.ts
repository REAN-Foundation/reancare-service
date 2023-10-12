import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface DonationCommunicationDto {
    id                         : uuid;
    PatientUserId?             : uuid;
    AcceptedDonorUserId?       : uuid;
    SelectedVolunteerUserId?   : uuid;
    SelectedDonationRecordId?  : uuid;
    FifthDayReminderFlag?      : boolean;
    DonorNoResponseFirstFlag?  : boolean;
    DonorNoResponseSecondFlag? : boolean;
    DonorAcceptance?           : string;
    IsRemindersLoaded?         : boolean;
}

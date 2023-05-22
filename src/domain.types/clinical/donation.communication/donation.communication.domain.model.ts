import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface DonationCommunicationDomainModel {
    id?                        : uuid;
    PatientUserId?             : uuid;
    DonorUserId?               : uuid;
    VolunteerUserId?           : uuid,
    FifthDayReminderFlag?      : boolean;
    DonorNoResponseFirstFlag?  : boolean;
    DonorNoResponseSecondFlag? : boolean;
    DonorAcceptance?           : string;
    IsRemindersLoaded?         : boolean;
}

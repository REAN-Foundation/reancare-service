import { uuid } from "../../../../domain.types/miscellaneous/system.types";

export interface DonationCommunicationDto {
    id                         : uuid;
    PatientUserId?             : uuid;
    TenantId?                  : uuid;
    DonorUserId?               : uuid;
    VolunteerUserId?           : uuid,
    DonationRecordId?           : uuid,
    FifthDayReminderFlag?      : boolean;
    DonorNoResponseFirstFlag?  : boolean;
    DonorNoResponseSecondFlag? : boolean;
    DonorAcceptance?           : string;
    IsRemindersLoaded?         : boolean;
}

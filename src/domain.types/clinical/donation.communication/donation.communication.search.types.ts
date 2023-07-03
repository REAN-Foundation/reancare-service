import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { BaseSearchResults, BaseSearchFilters } from "../../../domain.types/miscellaneous/base.search.types";
import { DonationCommunicationDto } from "./donation.communication.dto";

///////////////////////////////////////////////////////////////////////////////////

export interface DonationCommunicationSearchFilters extends BaseSearchFilters {
    PatientUserId?             : uuid;
    DonorUserId?               : uuid;
    VolunteerUserId?           : uuid,
    FifthDayReminderFlag?      : boolean;
    DonorNoResponseFirstFlag?  : boolean;
    DonorNoResponseSecondFlag? : boolean;
    DonorAcceptance?           : string;
    IsRemindersLoaded?         : boolean;
}

export interface DonationCommunicationSearchResults extends BaseSearchResults {
    Items: DonationCommunicationDto[];
}

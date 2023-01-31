import { BaseSearchResults, BaseSearchFilters } from "../../../domain.types/miscellaneous/base.search.types";
import { DonationRecordDto } from "./donation.record.dto";

///////////////////////////////////////////////////////////////////////////////////

export interface DonationRecordSearchFilters extends BaseSearchFilters {
    Name?              : string;
    PatientUserId?     : string;
    DonorUserId?       : string;
    VolunteerUserId?   : string;
    EmergencyDonor?    : string;
    VolunteerOfEmergencyDonor? : string;
    NetworkId?         : string;
    BloodGroup?        : string;
    Status?            : string;
    RequestedDateFrom? : Date;
    RequestedDateTo?   : Date;
    DonationDateFrom?  : Date;
    DonationDateTo?    : Date;
}

export interface DonationRecordSearchResults extends BaseSearchResults {
    Items: DonationRecordDto[];
}

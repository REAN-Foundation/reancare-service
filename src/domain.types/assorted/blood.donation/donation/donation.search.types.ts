import { BaseSearchFilters } from "../../../../domain.types/miscellaneous/base.search.types";
import { DonationDto } from "./donation.dto";
import { BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";

///////////////////////////////////////////////////////////////////////////////////

export interface DonationSearchFilters extends BaseSearchFilters {
    Name?                     : string;
    PatientUserId?            : string;
    TenantId?                 : string;
    DonorUserId?              : string;
    VolunteerUserId?          : string;
    EmergencyDonor?           : string;
    VolunteerOfEmergencyDonor?: string;
    NetworkId?                : string;
    BloodGroup?               : string;
    Status?                   : string;
    RequestedDateFrom?        : Date;
    RequestedDateTo?          : Date;
    DonationDateFrom?         : Date;
    DonationDateTo?           : Date;
}

export interface DonationSearchResults extends BaseSearchResults {
    Items: DonationDto[];
}

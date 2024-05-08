import { BaseSearchResults, BaseSearchFilters } from "../../../miscellaneous/base.search.types";
import { BridgeDto } from "./bridge.dto";

///////////////////////////////////////////////////////////////////////////////////

export interface BridgeSearchFilters extends BaseSearchFilters {
    Name?: string;
    PatientUserId?: string;
    TenantId?: string;
    DonorUserId?: string;
    VolunteerUserId?: string;
    BloodGroup? : string,
    Status? : string,
    NextDonationDateFrom?: Date;
    NextDonationDateTo?: Date;
    OnlyElligible?: boolean
}

export interface BridgeSearchResults extends BaseSearchResults {
    Items: BridgeDto[];
}

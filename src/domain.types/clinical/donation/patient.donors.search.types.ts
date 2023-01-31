import { BaseSearchResults, BaseSearchFilters } from "../../../domain.types/miscellaneous/base.search.types";
import { PatientDonorsDto } from "./patient.donors.dto";

///////////////////////////////////////////////////////////////////////////////////

export interface PatientDonorsSearchFilters extends BaseSearchFilters {
    Name?: string;
    PatientUserId?: string;
    DonorUserId?: string;
    VolunteerUserId?: string;
    BloodGroup? : string,
    Status? : string,
    NextDonationDateFrom?: Date;
    NextDonationDateTo?: Date;
    OnlyElligible?: boolean
}

export interface PatientDonorsSearchResults extends BaseSearchResults {
    Items: PatientDonorsDto[];
}

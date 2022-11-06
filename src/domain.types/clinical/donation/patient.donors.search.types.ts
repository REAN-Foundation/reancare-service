import { BaseSearchResults, BaseSearchFilters } from "../../../domain.types/miscellaneous/base.search.types";
import { Gender } from "../../miscellaneous/system.types";
import { PatientDonorsDto } from "./patient.donors.dto";

///////////////////////////////////////////////////////////////////////////////////

export interface PatientDonorsSearchFilters extends BaseSearchFilters {
    Name?: string;
    PatientUserId?: string;
    DonorUserId?: string;
    VolunteerUserId?: Gender;
    BloodGroup? : string,
    Status? : string,
    NextDonationDateFrom?: Date;
    NextDonationDateTo?: Date;
    OnlyElligible?: boolean
}

export interface PatientDonorsSearchResults extends BaseSearchResults {
    Items: PatientDonorsDto[];
}

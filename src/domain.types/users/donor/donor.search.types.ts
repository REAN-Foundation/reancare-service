import { DonorType } from "../../../domain.types/miscellaneous/clinical.types";
import { Gender } from "../../miscellaneous/system.types";
import { DonorDetailsDto, DonorDto } from "./donor.dto";

///////////////////////////////////////////////////////////////////////////////////

export interface DonorSearchFilters {
    Phone?: string;
    Email?: string;
    Name?: string;
    Gender?: Gender;
    BloodGroup? : string,
    AcceptorUserId? : string,
    MedIssues? : string,
    OnlyEligible? : boolean | string,
    IsAvailable? : boolean,
    HasDonatedEarlier? : boolean,
    DonorType?  : DonorType;
    CreatedDateFrom?: Date;
    CreatedDateTo?: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface DonorSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: DonorDto[];
}

export interface DonorDetailsSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: DonorDetailsDto[];
}

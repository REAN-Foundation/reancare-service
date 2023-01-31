import { Gender } from "../../miscellaneous/system.types";
import { DoctorDetailsDto, DoctorDto } from "./doctor.dto";

///////////////////////////////////////////////////////////////////////////////////

export interface DoctorSearchFilters {
    Phone?: string;
    Email?: string;
    Name?: string;
    Gender?: Gender;
    PractisingSinceFrom?: Date;
    PractisingSinceTo?: Date;
    Locality?: string;
    Qualifications?: string;
    Specialities?: string;
    ProfessionalHighlights?: string;
    ConsultationFeeFrom?: number;
    ConsultationFeeTo?: number;
    CreatedDateFrom?: Date;
    CreatedDateTo?: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface DoctorSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: DoctorDto[];
}

export interface DoctorDetailsSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: DoctorDetailsDto[];
}

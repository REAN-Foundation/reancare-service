import { MeditationDto, MeditationForDayDto } from "./meditation.dto";

export interface MeditationSearchFilters {
    PatientUserId: string;
    Meditation: number;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

export interface MeditationSearchResults {
    TotalCount: number;
    RetrievedCount: number;
    PageIndex: number;
    ItemsPerPage: number;
    Order: string;
    OrderedBy: string;
    Items: MeditationDto[] | MeditationForDayDto[];
}

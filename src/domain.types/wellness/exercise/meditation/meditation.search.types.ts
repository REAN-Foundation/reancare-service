import { BaseSearchResults, BaseSearchFilters } from "../../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { MeditationDto, MeditationForDayDto } from "./meditation.dto";

export interface MeditationSearchFilters extends BaseSearchFilters{
    PatientUserId: uuid;
    Meditation: string;
}

export interface MeditationSearchResults extends BaseSearchResults {
    Items: MeditationDto[] | MeditationForDayDto[];
}

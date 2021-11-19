import { BaseSearchResults, BaseSearchFilters } from "../../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { HowDoYouFeelDto } from "./how.do.you.feel.dto";
import { SymptomsProgress } from "./symptom.progress.types";

//////////////////////////////////////////////////////////////////////

export interface HowDoYouFeelSearchFilters extends BaseSearchFilters{
    PatientUserId?       : uuid;
    Feeling?             : SymptomsProgress;
    DateFrom?            : Date;
    DateTo?              : Date;
}

export interface HowDoYouFeelSearchResults extends BaseSearchResults{
    Items         : HowDoYouFeelDto[];
}

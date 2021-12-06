import { BaseSearchResults, BaseSearchFilters } from "../../miscellaneous/base.search.types";
import { uuid } from "../../miscellaneous/system.types";
import { DailyAssessmentDto } from "./daily.assessment.dto";
import { DailyAssessmentEnergyLevels, DailyAssessmentFeelings, DailyAssessmentMoods } from "./daily.assessment.types";

//////////////////////////////////////////////////////////////////////

export interface DailyAssessmentSearchFilters extends BaseSearchFilters{
    PatientUserId?: uuid;
    Feeling?      : DailyAssessmentFeelings;
    Mood?         : DailyAssessmentMoods;
    EnergyLevels? : DailyAssessmentEnergyLevels[];
    DateFrom?     : Date;
    DateTo?       : Date;
}

export interface DailyAssessmentSearchResults extends BaseSearchResults{
    Items         : DailyAssessmentDto[];
}

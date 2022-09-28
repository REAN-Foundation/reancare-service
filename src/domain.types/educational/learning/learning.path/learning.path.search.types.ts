import { BaseSearchFilters, BaseSearchResults } from "../../../miscellaneous/base.search.types";
import { LearningPathDto } from "./learning.path.dto";

//////////////////////////////////////////////////////////////////////

export interface LearningPathSearchFilters extends BaseSearchFilters{
    Name?: string;
}

export interface LearningPathSearchResults extends BaseSearchResults{
    Items: LearningPathDto[];
}

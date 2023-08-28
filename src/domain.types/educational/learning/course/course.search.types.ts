import { uuid } from "../../../miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../../miscellaneous/base.search.types";
import { CourseDto } from "./course.dto";

//////////////////////////////////////////////////////////////////////

export interface CourseSearchFilters extends BaseSearchFilters{
    Name?            : string;
    DurationInDays?  : number;
    LearningPathId?  : uuid;
}

export interface CourseSearchResults extends BaseSearchResults{
    Items: CourseDto[];
}

import { BaseSearchResults, BaseSearchFilters } from "../../../miscellaneous/base.search.types";
import { uuid } from "../../../miscellaneous/system.types";
import { CourseContentDto } from "./course.content.dto";
import { CourseContentType } from "./course.content.type";

export interface CourseContentSearchFilters extends BaseSearchFilters{
    Title?          : string;
    LearningPathId? : uuid;
    CourseId?       : uuid;
    ModuleId?       : uuid;
    DurationFrom?   : number;
    DurationTo?     : number;
    ContentType?    : CourseContentType;
    Sequence?       : number;
}

export interface CourseContentSearchResults extends BaseSearchResults{
    Items: CourseContentDto[];
}

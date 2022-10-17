import { BaseSearchResults, BaseSearchFilters } from "../../../miscellaneous/base.search.types";
import { uuid } from "../../../miscellaneous/system.types";
import { CourseModuleDto } from "./course.module.dto";

export interface CourseModuleSearchFilters extends BaseSearchFilters{
    Name?           : string;
    LearningPathId? : uuid;
    CourseId?       : uuid;
    DurationInMins? : number;
}

export interface CourseModuleSearchResults extends BaseSearchResults{
    Items: CourseModuleDto[];
}

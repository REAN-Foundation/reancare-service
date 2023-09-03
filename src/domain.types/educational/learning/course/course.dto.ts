import { uuid } from "../../../miscellaneous/system.types";
import { CourseModuleDto } from "../course.module/course.module.dto";
import { LearningPathDto } from "../learning.path/learning.path.dto";

export interface CourseDto {
    id?             : uuid,
    LearningPaths?  : LearningCourseDto[];
    Name?           : string;
    Description?    : string;
    ImageUrl?       : string;
    DurationInDays? : number;
    Modules?        : CourseModuleDto[];
    CreatedAt?      : Date;
}
export interface LearningCourseDto {
    id?                 : uuid,
    LearningPaths?      : LearningPathDto[];
}

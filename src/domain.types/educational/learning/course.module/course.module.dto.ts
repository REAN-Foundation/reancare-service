import { uuid } from "../../../miscellaneous/system.types";
import { CourseContentDto } from "../course.content/course.content.dto";

export interface CourseModuleDto {
    id?             : uuid;
    LearningPathId? : uuid;
    CourseId?       : uuid;
    Name            : string;
    Description?    : string;
    ImageUrl?       : string;
    DurationInMins? : number;
    Contents?       : CourseContentDto[];
    Sequence?       : number;
}

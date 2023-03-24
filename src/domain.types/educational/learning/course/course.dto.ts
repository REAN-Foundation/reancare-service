import { uuid } from "../../../miscellaneous/system.types";
import { CourseModuleDto } from "../course.module/course.module.dto";

export interface CourseDto {
    id?             : uuid,
    LearningPathId? : uuid;
    Name?           : string;
    Description?    : string;
    ImageUrl?       : string;
    DurationInDays? : number;
    Modules?        : CourseModuleDto[];
    CreatedAt?          : Date;
}

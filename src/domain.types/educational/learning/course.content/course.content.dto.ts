import { uuid } from "../../../miscellaneous/system.types";
import { CourseContentType } from "./course.content.type";

export interface CourseContentDto {
    id?              : uuid;
    LearningPathId?  : uuid;
    CourseId?        : uuid;
    ModuleId?        : uuid;
    Title?           : string;
    Description?     : string;
    ImageUrl?        : string;
    DurationInMins?  : number;
    ContentType?     : CourseContentType;
    ResourceLink?    : string;
    ActionTemplateId?: uuid;
    Sequence?        : number;
    Course?          : any,
}

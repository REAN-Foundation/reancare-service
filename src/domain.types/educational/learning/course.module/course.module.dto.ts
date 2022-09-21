import { uuid } from "../../../miscellaneous/system.types";

export interface CourseModuleDto {
    id?             : uuid;
    LearningPathId? : uuid;
    CourseId?       : uuid;
    Name            : string;
    Description?    : string;
    ImageUrl?       : string;
    DurationInMins? : number;
}

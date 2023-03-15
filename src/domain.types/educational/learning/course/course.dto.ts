import { uuid } from "../../../miscellaneous/system.types";

export interface CourseDto {
    id?             : uuid,
    LearningPathId? : uuid;
    Name?           : string;
    Description?    : string;
    ImageUrl?       : string;
    DurationInDays? : number;
    Modules?        : any[];
}

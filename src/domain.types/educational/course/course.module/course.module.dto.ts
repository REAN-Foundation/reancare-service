import { uuid } from "../../../miscellaneous/system.types";

export interface CourseModuleDto {
    id?             : uuid;
    CourseId?       : uuid;
    Name            : string;
    Description?    : string;
    ImageUrl?       : string;
    DurationInMins? : number;
}

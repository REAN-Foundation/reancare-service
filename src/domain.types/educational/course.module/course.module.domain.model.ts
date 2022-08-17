import { uuid } from "../../miscellaneous/system.types";

export interface CourseModuleDomainModel {
    id?             : uuid;
    CourseId?       : uuid;
    Name            : string;
    Description?    : string;
    ImageUrl?       : string;
    DurationInMins? : number;
}

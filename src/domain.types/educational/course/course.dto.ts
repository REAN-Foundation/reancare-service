import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface CourseDto {
    id?             : uuid,
    Name?           : string;
    Description?    : string;
    ImageUrl?       : string;
    DurationInDays? : number;
    StartDate?      : Date;
    EndDate?        : Date;
}

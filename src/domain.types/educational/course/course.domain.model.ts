import { uuid } from "../../miscellaneous/system.types";

export interface CourseDomainModel {
    id?             : uuid,
    Name?           : string;
    Description?    : string;
    ImageUrl?       : string;
    DurationInDays? : number;
    StartDate?      : Date;
    EndDate?        : Date;
}

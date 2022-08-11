import { uuid } from "../../miscellaneous/system.types";

export interface CourseDomainModel {
    id?          : uuid,
    Name?        : string;
    Description? : string;
    ImageUrl?    : string;
    Duration?    : number;
    StartDate?   : Date;
    EndDate?     : Date;

}

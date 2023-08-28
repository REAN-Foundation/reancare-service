import { Gender, uuid } from "../../miscellaneous/system.types";

export interface UserSearchFilters {
    Phone          : string;
    Email          : string;
    UserId         : uuid;
    Name           : string;
    Gender         : Gender;
    BirthdateFrom  : Date;
    BirthdateTo    : Date;
    CreatedDateFrom: Date;
    CreatedDateTo  : Date;
    OrderBy        : string;
    Order          : string;
    PageIndex      : number;
    ItemsPerPage   : number;
}

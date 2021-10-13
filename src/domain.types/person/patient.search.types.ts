import { Gender } from "../miscellaneous/system.types";

export interface PersonSearchFilters {
    Phone: string;
    Email: string;
    UserId: string;
    Name: string;
    Gender: Gender;
    BirthdateFrom: Date;
    BirthdateTo: Date;
    CreatedDateFrom: Date;
    CreatedDateTo: Date;
    OrderBy: string;
    Order: string;
    PageIndex: number;
    ItemsPerPage: number;
}

import { BaseSearchResults } from "../miscellaneous/base.search.types";
import { Gender } from "../miscellaneous/system.types";
import { PersonDto } from "./person.dto";

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

export interface PersonSearchResults extends BaseSearchResults {
    Items: PersonDto[];
}
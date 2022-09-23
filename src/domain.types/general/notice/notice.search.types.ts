import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { NoticeDto } from "./notice.dto";

export interface NoticeSearchFilters extends BaseSearchFilters{
    Title?       : string;
    Description? : string;
    Link?        : string;
    PostDate?    : Date;
    EndDate?     : Date;
    DaysActive?  : number;
    IsActive?    : boolean;
    Tags?        : string;
    ImageUrl?    : string;
    Action?      : string;
}

export interface NoticeSearchResults extends BaseSearchResults{
    Items: NoticeDto[];
}

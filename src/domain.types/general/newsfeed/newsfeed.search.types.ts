import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { NewsfeedDto } from "./newsfeed.dto";

//////////////////////////////////////////////////////////////////////

export interface NewsfeedSearchFilters extends BaseSearchFilters{
    Title?         : string;
    Type?          : string;
    SentOn?        : Date;
    ReadOn?        : Date;
}

export interface NewsfeedSearchResults extends BaseSearchResults{
    Items: NewsfeedDto[];
}

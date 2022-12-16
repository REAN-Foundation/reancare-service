import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { RssfeedDto } from "./rss.feed.dto";

//////////////////////////////////////////////////////////////////////

export interface RssfeedSearchFilters  extends BaseSearchFilters{
    Title?   : string;
    Category?: string;
    Tags?    : string;
}

export interface RssfeedSearchResults extends BaseSearchResults{
    Items: RssfeedDto[];
}

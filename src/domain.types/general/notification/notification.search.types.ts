import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";
import { NotificationDto } from "./notification.dto";

//////////////////////////////////////////////////////////////////////

export interface NotificationSearchFilters extends BaseSearchFilters{
    Title?         : string;
    Type?          : string;
    SentOn?        : Date;
    ReadOn?        : Date;
}

export interface NotificationSearchResults extends BaseSearchResults{
    Items: NotificationDto[];
}

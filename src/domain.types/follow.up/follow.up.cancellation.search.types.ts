import { BaseSearchFilters, BaseSearchResults } from "../miscellaneous/base.search.types";
import { uuid } from "../miscellaneous/system.types";
import { FollowUpCancellationDto } from "./follow.up.cancellation.dto";

export interface FollowUpCancellationSearchFilters extends BaseSearchFilters {
    TenantId?            : uuid;
    TenantName?          : string;
    CancelDate?          : Date;
}

export interface FollowUpCancellationSearchResults extends BaseSearchResults {
    Items : FollowUpCancellationDto[];
}

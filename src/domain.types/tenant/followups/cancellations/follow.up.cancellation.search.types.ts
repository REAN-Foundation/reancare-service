import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../../../domain.types/miscellaneous/base.search.types";
import { FollowUpCancellationDto } from "./follow.up.cancellation.dto";

export interface FollowUpCancellationSearchFilters extends BaseSearchFilters {
    TenantId?            : uuid;
    TenantName?          : string;
    CancelDate?          : Date;
    DateFrom?            : Date;
    DateTo?              : Date;
}

export interface FollowUpCancellationSearchResults extends BaseSearchResults {
    Items : FollowUpCancellationDto[];
}

import { BaseSearchFilters, BaseSearchResults } from "../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface CohortUpdateDomainModel {
    TenantId   ?: uuid;
    Name       ?: string;
    Description?: string;
    ImageUrl   ?: string;
    OwnerUserId?: uuid;
}

export interface CohortCreateDomainModel {
    TenantId   ?: uuid;
    Name       ?: string;
    Description?: string;
    ImageUrl   ?: string;
    OwnerUserId?: uuid;
}

export interface CohortSearchFilters extends BaseSearchFilters {
    Name     ?: string;
    UserId   ?: uuid;
    TenantId ?: uuid;
}

export interface CohortDto {
    id         : uuid;
    TenantId   : uuid;
    Name       : string;
    Description: string;
    ImageUrl   : string;
    OwnerUserId: uuid;
    CreatedAt  : Date;
    UpdatedAt  : Date;
}

export interface CohortSearchResults extends BaseSearchResults {
    Items: CohortDto[];
}

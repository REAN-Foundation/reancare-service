import { BaseSearchFilters, BaseSearchResults } from "../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface UserGroupCreateDomainModel {
    Name        : string;
    Description?: string;
    OwnerUserId : uuid;
}

export interface UserGroupUpdateDomainModel {
    Name       ?: string;
    Description?: string;
}

export interface UserGroupSearchFilters extends BaseSearchFilters {
    Name?: string;
    UserId?: uuid;
}

export interface UserGroupDto {
    id          : uuid;
    Name        : string;
    Description?: string;
    OwnerUserId : uuid;
    Owner      ?: any;
    CreatedAt   : Date;
    UpdatedAt   : Date;
    Users      ?: any[];
}

export interface UserGroupSearchResults extends BaseSearchResults {
    Items: UserGroupDto[];
}

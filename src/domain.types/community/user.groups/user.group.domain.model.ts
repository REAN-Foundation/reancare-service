import { BaseSearchFilters, BaseSearchResults } from "../../../domain.types/miscellaneous/base.search.types";
import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface UserGroupCreateDomainModel {
    Name: string;
    Description?: string;
    CreatedByUserId: uuid;
}

export interface UserGroupUpdateDomainModel {
    Name?: string;
    Description?: string;
    UpdatedByUserId: uuid;
}

export interface UserGroupSearchFilters extends BaseSearchFilters {
    Name?: string;
    UserId?: uuid;
}

export interface UserGroupDto {
    id              : uuid;
    Name            : string;
    Description    ?: string;
    CreatedByUserId : uuid;
    CreatedByUser  ?: any;
    CreatedAt       : Date;
    UpdatedByUserId : uuid;
    UpdatedByUser  ?: any;
    UpdatedAt       : Date;
}

export interface UserGroupSearchResults extends BaseSearchResults {
    Items: UserGroupDto[];
}

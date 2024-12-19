import { BaseSearchFilters, BaseSearchResults } from "../../../domain.types/miscellaneous/base.search.types";
import { Gender, uuid } from "../../miscellaneous/system.types";
import { UserDto } from "./user.dto";

export interface UserSearchFilters extends BaseSearchFilters {
    TenantId?: uuid;
    Phone   ?: string;
    Email   ?: string;
    UserId  ?: uuid;
    Name    ?: string;
    Gender  ?: Gender;
    UserName?: string;
    RoleIds?: string[];
    LastLoginDateFrom?: Date;
    LastLoginDateTo?: Date;
}

export interface UserSearchResults extends BaseSearchResults {
    Items: UserDto[];
}

import { BaseSearchFilters, BaseSearchResults } from "../miscellaneous/base.search.types";
import { uuid } from "../miscellaneous/system.types";
import { RoleDto } from "./role.dto";

export interface RoleSearchFilters extends BaseSearchFilters {
  RoleName     ?: string;
  TenantId     ?: uuid;
  ParentRoleId ?: number;
  IsSystemRole ?: boolean;
  IsUserRole   ?: boolean;
  IsDefaultRole?: boolean;
}

export interface RoleSearchResults extends BaseSearchResults {
    Items         : RoleDto[];
}

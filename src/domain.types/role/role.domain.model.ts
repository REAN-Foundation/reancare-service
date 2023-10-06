import { uuid } from "../miscellaneous/system.types";

export interface RoleDomainModel {
  id?           : number;
  RoleName      : string;
  Description?  : string;
  TenantId?     : uuid;
  ParentRoleId ?: number;
  IsSystemRole ?: boolean;
  IsUserRole?   : boolean;
  IsDefaultRole?: boolean;
}

export interface RoleSearchFilters {
  RoleName     ?: string;
  TenantId     ?: uuid;
  ParentRoleId ?: number;
  IsSystemRole ?: boolean;
  IsUserRole   ?: boolean;
  IsDefaultRole?: boolean;
}

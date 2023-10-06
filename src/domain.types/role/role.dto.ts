export interface RoleDto {
    id            : number;
    RoleName      : string;
    Description  ?: string;
    TenantId     ?: string;
    ParentRoleId ?: number;
    IsSystemRole ?: boolean;
    IsUserRole    : boolean;
    IsDefaultRole : boolean;
    CreatedAt    ?: Date;
}

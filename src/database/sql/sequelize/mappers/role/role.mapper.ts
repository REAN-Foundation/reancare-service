import Role from '../../models/role/role.model';
import { RoleDto } from "../../../../../domain.types/role/role.dto";

///////////////////////////////////////////////////////////////////////////////////

export class RoleMapper {

    static toDto = (role: Role): RoleDto => {
        if (role == null){
            return null;
        }
        const dto: RoleDto = {
            id            : role.id,
            RoleName      : role.RoleName,
            Description   : role.Description,
            TenantId      : role.TenantId,
            ParentRoleId  : role.ParentRoleId,
            IsSystemRole  : role.IsSystemRole,
            IsUserRole    : role.IsUserRole,
            IsDefaultRole : role.IsDefaultRole,
            CreatedAt     : role.CreatedAt,
        };
        return dto;
    };

}

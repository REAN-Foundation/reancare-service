import Role from '../models/role.model';
import { RoleDto } from "../../../domain.types/role.domain.types";

///////////////////////////////////////////////////////////////////////////////////

export class RoleMapper {

    static toDto = (role: Role): RoleDto => {
        if (role == null){
            return null;
        }
        const dto: RoleDto = {
            id       : role.id,
            RoleName : role.RoleName
        };
        return dto;
    }

}


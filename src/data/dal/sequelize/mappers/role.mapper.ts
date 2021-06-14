import { RoleRepo } from "../repositories/role.repo";
import { Role } from '../models/role.model';
import { RoleDTO } from "../../../domain.types/role.domain.types";


///////////////////////////////////////////////////////////////////////////////////

export class RoleMapper {

    static toDTO = (role: Role): RoleDTO => {
        if(role == null){
            return null;
        }
        var dto: RoleDTO = {
            id: role.id,
            RoleName: role.RoleName
        };
        return dto;
    }

}


import { RoleRepo } from "../repositories/role.repo";
import PersonRole from '../models/person.role.model';
import { UserRoleDto } from "../../../domain.types/role.domain.types";


///////////////////////////////////////////////////////////////////////////////////

export class UserRoleMapper {

    static toDto = async (userRole: PersonRole): Promise<UserRoleDto> => {

        if(userRole == null){
            return null;
        }
        var roleRepo = new RoleRepo();
        const role = await roleRepo.getById(userRole.RoleId);
        var dto: UserRoleDto = {
            id: userRole.id,
            UserId: userRole.UserId,
            RoleId: userRole.RoleId,
            RoleName: role.RoleName
        };
        return dto;
    }

}
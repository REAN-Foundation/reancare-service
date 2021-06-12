import { RoleRepo } from "../repositories/role.repo";
import { UserRole } from '../models/user.role.model';
import { UserRoleDTO } from "../../../dtos/user.role.dto";


///////////////////////////////////////////////////////////////////////////////////

export class UserRoleMapper {

    static toDTO = async (userRole: UserRole): Promise<UserRoleDTO> => {

        if(userRole == null){
            return null;
        }
        var roleRepo = new RoleRepo();
        const role = await roleRepo.getById(userRole.RoleId);
        var dto: UserRoleDTO = {
            id: userRole.id,
            UserId: userRole.UserId,
            RoleId: userRole.RoleId,
            RoleName: role.RoleName
        };
        return dto;
    }

}
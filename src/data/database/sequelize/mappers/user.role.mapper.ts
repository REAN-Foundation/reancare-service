import { RoleRepo } from "../repositories/role.repo";
import PersonRole from '../models/person.role.model';
import { PersonRoleDto } from "../../../domain.types/role.domain.types";


///////////////////////////////////////////////////////////////////////////////////

export class UserRoleMapper {

    static toDto = async (personRole: PersonRole): Promise<PersonRoleDto> => {

        if(personRole == null){
            return null;
        }
        var roleRepo = new RoleRepo();
        const role = await roleRepo.getById(personRole.RoleId);
        var dto: PersonRoleDto = {
            id: personRole.id,
            PersonId: personRole.PersonId,
            RoleId: personRole.RoleId,
            RoleName: role.RoleName
        };
        return dto;
    }

}
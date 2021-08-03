import { RoleRepo } from "../repositories/role.repo";
import PersonRole from '../models/person.role.model';
import { PersonRoleDto } from "../../../domain.types/role.domain.types";

///////////////////////////////////////////////////////////////////////////////////

export class PersonRoleMapper {

    static toDto = async (personRole: PersonRole): Promise<PersonRoleDto> => {

        if (personRole == null){
            return null;
        }
        const roleRepo = new RoleRepo();
        const role = await roleRepo.getById(personRole.RoleId);
        const dto: PersonRoleDto = {
            id       : personRole.id,
            PersonId : personRole.PersonId,
            RoleId   : personRole.RoleId,
            RoleName : role.RoleName
        };
        return dto;
    }

}

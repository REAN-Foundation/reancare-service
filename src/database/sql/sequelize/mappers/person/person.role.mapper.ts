import PersonRole from '../../models/person/person.role.model';
import { PersonRoleDto } from "../../../../../domain.types/role/person.role.dto";

///////////////////////////////////////////////////////////////////////////////////

export class PersonRoleMapper {

    static toDto = async (personRole: PersonRole): Promise<PersonRoleDto> => {

        if (personRole == null){
            return null;
        }
        const dto: PersonRoleDto = {
            id       : personRole.id,
            PersonId : personRole.PersonId,
            RoleId   : personRole.RoleId,
            RoleName : personRole.RoleName
        };
        return dto;
    };

}

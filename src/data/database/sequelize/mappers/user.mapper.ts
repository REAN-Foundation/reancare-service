import { UserDetailsDto, UserDto } from "../../../domain.types/user.domain.types";
import { RoleRepo } from "../repositories/role.repo";
import { PersonRepo } from '../repositories/person.repo'
import User from '../models/user.model';
import { Helper } from '../../../../common/helper';
import { PersonDetailsDto, PersonDto } from "../../../domain.types/person.domain.types";
import { RoleDto } from "../../../domain.types/role.domain.types";

///////////////////////////////////////////////////////////////////////////////////

export class UserMapper {

    static toDetailsDto = async (user: User, personDto?: PersonDetailsDto): Promise<UserDetailsDto> => {

        if(user == null){
            return null;
        }

        if(personDto == null) {
            var personRepo = new PersonRepo();
            personDto = await personRepo.getById(user.PersonId);
        }

        var role: RoleDto = null;
        if(user.RoleId != null) {
            var roleRepo = new RoleRepo();
            role = await roleRepo.getById(user.RoleId);
        }

        var dto: UserDetailsDto = {
            id: user.id,
            UserName: user.UserName,
            Person: personDto,
            LastLogin: user.LastLogin,
            DefaultTimeZone:user.DefaultTimeZone,
            CurrentTimeZone:user.CurrentTimeZone,
            Role: role
        };
        return dto;
    }

    toDto = (user: User, personDto: PersonDto) => {

        if(user == null){
            return null;
        }
        var dto: UserDto = {
            id: user.id,
            Person: personDto,
            CurrentTimeZone: user.CurrentTimeZone,
            DefaultTimeZone: user.DefaultTimeZone
        };
        return dto;
    }
}
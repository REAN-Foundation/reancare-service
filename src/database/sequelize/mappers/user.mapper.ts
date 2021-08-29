import { RoleRepo } from "../repositories/role.repo";
import { PersonRepo } from '../repositories/person.repo'
import User from '../models/user.model';
import { PersonDetailsDto, PersonDto } from '../../../domain.types/person/person.dto';
import { UserDetailsDto, UserDto } from '../../../domain.types/user/user.dto';
import { RoleDto } from '../../../domain.types/role/role.dto';

///////////////////////////////////////////////////////////////////////////////////

export class UserMapper {

    static toDetailsDto = async (user: User, personDto?: PersonDetailsDto): Promise<UserDetailsDto> => {

        if (user == null){
            return null;
        }

        if (personDto == null) {
            const personRepo = new PersonRepo();
            personDto = await personRepo.getById(user.PersonId);
        }

        let role: RoleDto = null;
        if (user.RoleId != null) {
            const roleRepo = new RoleRepo();
            role = await roleRepo.getById(user.RoleId);
        }

        const dto: UserDetailsDto = {
            id              : user.id,
            UserName        : user.UserName,
            Person          : personDto,
            LastLogin       : user.LastLogin,
            DefaultTimeZone : user.DefaultTimeZone,
            CurrentTimeZone : user.CurrentTimeZone,
            Role            : role
        };
        return dto;
    }

    toDto = (user: User, personDto: PersonDto) => {

        if (user == null){
            return null;
        }
        const dto: UserDto = {
            id              : user.id,
            Person          : personDto,
            CurrentTimeZone : user.CurrentTimeZone,
            DefaultTimeZone : user.DefaultTimeZone
        };
        return dto;
    }

}

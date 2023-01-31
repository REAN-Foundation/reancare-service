import User from '../../../models/users/user/user.model';
import { PersonDetailsDto, PersonDto } from '../../../../../../domain.types/person/person.dto';
import { UserDetailsDto, UserDto } from '../../../../../../domain.types/users/user/user.dto';

///////////////////////////////////////////////////////////////////////////////////

export class UserMapper {

    static toDetailsDto = async (user: User, personDto: PersonDetailsDto = null): Promise<UserDetailsDto> => {

        if (user == null){
            return null;
        }

        const dto: UserDetailsDto = {
            id              : user.id,
            UserName        : user.UserName,
            PersonId        : user.PersonId,
            Person          : personDto,
            LastLogin       : user.LastLogin,
            DefaultTimeZone : user.DefaultTimeZone,
            CurrentTimeZone : user.CurrentTimeZone,
            RoleId          : user.RoleId,
            Role            : null
        };
        return dto;
    };

    toDto = (user: User, personDto: PersonDto) => {

        if (user == null){
            return null;
        }
        const dto: UserDto = {
            id              : user.id,
            PersonId        : user.PersonId,
            Person          : personDto,
            CurrentTimeZone : user.CurrentTimeZone,
            DefaultTimeZone : user.DefaultTimeZone
        };
        return dto;
    };

}

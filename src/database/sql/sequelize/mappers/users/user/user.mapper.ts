import User from '../../../models/users/user/user.model';
import { PersonDetailsDto, PersonDto } from '../../../../../../domain.types/person/person.dto';
import { UserDetailsDto, UserDto } from '../../../../../../domain.types/users/user/user.dto';
import Tenant from '../../../models/tenant/tenant.model';

///////////////////////////////////////////////////////////////////////////////////

export class UserMapper {

    static toDetailsDto = (user: User, tenant: Tenant = null, personDto: PersonDetailsDto = null)
        : UserDetailsDto => {

        if (user == null){
            return null;
        }

        const dto: UserDetailsDto = {
            id              : user.id,
            UserName        : user.UserName,
            PersonId        : user.PersonId,
            TenantId        : tenant?.id,
            Person          : personDto,
            IsTestUser      : user.IsTestUser,
            LastLogin       : user.LastLogin,
            DefaultTimeZone : user.DefaultTimeZone,
            CurrentTimeZone : user.CurrentTimeZone,
            RoleId          : user.RoleId,
            Role            : null
        };
        return dto;
    };

    toDto = (user: User, tenant: Tenant = null, personDto: PersonDto) => {

        if (user == null){
            return null;
        }
        const dto: UserDto = {
            id              : user.id,
            PersonId        : user.PersonId,
            TenantId        : tenant?.id,
            Person          : personDto,
            CurrentTimeZone : user.CurrentTimeZone,
            DefaultTimeZone : user.DefaultTimeZone
        };
        return dto;
    };

}

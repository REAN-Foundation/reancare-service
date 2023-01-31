import { UserLoginSessionDomainModel } from '../../../../../../domain.types/users/user.login.session/user.login.session.domain.model';
import { UserLoginSessionDto } from '../../../../../../domain.types/users/user.login.session/user.login.session.dto';

///////////////////////////////////////////////////////////////////////////////////

export class UserLoginSessionMapper {

    static toDto = (
        userLoginSession: UserLoginSessionDomainModel): UserLoginSessionDto => {
        if (userLoginSession == null) {
            return null;
        }
        const dto: UserLoginSessionDto = {
            id        : userLoginSession.id,
            UserId    : userLoginSession.UserId,
            IsActive  : userLoginSession.IsActive,
            StartedAt : userLoginSession.StartedAt,
            ValidTill : userLoginSession.ValidTill,
        };
        return dto;
    };

}

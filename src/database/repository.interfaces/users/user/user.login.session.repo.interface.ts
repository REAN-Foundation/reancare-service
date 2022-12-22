import { UserLoginSessionDomainModel } from '../../../../domain.types/users/user.login.session/user.login.session.domain.model';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';

////////////////////////////////////////////////////////////////////////////////////

export interface IUserLoginSessionRepo {

    create(userLoginSessionDomainModel: UserLoginSessionDomainModel);

    isValidUserLoginSession(sessionId: uuid);

    invalidateSession(sessionId: uuid);

    invalidateAllSessions(userId: uuid);
}

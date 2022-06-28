import { IUserLoginSessionRepo } from '../../../../../database/repository.interfaces/user/user.login.session.repo.interface';
import { uuid } from '../../../../../domain.types/miscellaneous/system.types';
import UserLoginSession from '../../models/user/user.login.session.model';
import { UserLoginSessionDomainModel } from '../../../../../domain.types/user/user.login.session/user.login.session.domain.model';
import { UserLoginSessionDto } from '../../../../../domain.types/user/user.login.session/user.login.session.dto';
import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { UserLoginSessionMapper } from '../../mappers/user/user.login.session.mapper';

///////////////////////////////////////////////////////////////////////////////////

export class UserLoginSessionRepo implements IUserLoginSessionRepo {

    create = async (createModel: UserLoginSessionDomainModel):
    Promise<UserLoginSessionDto> => {
        try {
            const entity = {
                UserId    : createModel.UserId,
                IsActive  : createModel.IsActive,
                StartedAt : createModel.StartedAt,
                ValidTill : createModel.ValidTill,
            };

            const loginSession = await UserLoginSession.create(entity);
            return await UserLoginSessionMapper.toDto(loginSession);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    isValidUserLoginSession = async (sessionId: uuid): Promise<boolean> => {

        const userLoginSessionDetails = await UserLoginSession.findByPk(sessionId);
        var now = new Date();
        if (now > userLoginSessionDetails.ValidTill) {
            return false;
        }
        
        return userLoginSessionDetails.IsActive;
    };

    invalidateSession = async (sessionId: uuid): Promise<boolean> => {
       
        const userLoginSessionDetails = await UserLoginSession.findByPk(sessionId);
        userLoginSessionDetails.IsActive = false;
        await userLoginSessionDetails.save();
        return true;
    };

}

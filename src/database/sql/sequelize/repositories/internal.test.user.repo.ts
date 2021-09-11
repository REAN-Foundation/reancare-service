import { IInternalTestUserRepo } from '../../../repository.interfaces/internal.test.user.repo.interface';
import InternalTestUser from '../models/internal.test.user';
import { Logger } from '../../../../common/logger';
import { ApiError } from '../../../../common/api.error';

///////////////////////////////////////////////////////////////////////

export class InternalTestUserRepo implements IInternalTestUserRepo {

    create = async (phone: string): Promise<any> => {
        try {
            const entity = {
                Phone : phone
            };
            return await InternalTestUser.create(entity);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    isInternalTestUser = async (phone: string): Promise<boolean> => {
        try {
            const internalTestUsers = await InternalTestUser.findAll({
                where : {
                    Phone : phone
                }
            });
            return internalTestUsers.length > 0;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}

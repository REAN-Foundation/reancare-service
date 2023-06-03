import { uuid } from '../../../../../domain.types/miscellaneous/system.types';
import User from '../../models/users/user/user.model';
import Person from '../../models/person/person.model';
import { IUserGroupRepo } from '../../../../repository.interfaces/community/user.group.repo.interface';

///////////////////////////////////////////////////////////////////////////////////////

export class UserGroupRepo implements IUserGroupRepo {
    addUserToGroup(groupId: string, userId: string): Promise<boolean> {
        
    }
}

import { UserService } from '../../../../services/users/user/user.service';
import { Loader } from '../../../../startup/loader';
import { BaseValidator } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class StatisticsValidator  extends BaseValidator {

    _userService: UserService = null;

    constructor() {
        super();
        this._userService = Loader.container.resolve(UserService);
    }

}

import { Injector } from '../../../../startup/injector';
import { UserService } from '../../../../services/users/user/user.service';
import { BaseValidator } from '../../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class StatisticsValidator  extends BaseValidator {

    _userService: UserService = null;

    constructor() {
        super();
        this._userService = Injector.Container.resolve(UserService);
    }

}

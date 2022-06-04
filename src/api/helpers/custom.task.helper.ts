import { ApiError } from '../../common/api.error';
import { UserTaskDomainModel } from '../../domain.types/user/user.task/user.task.domain.model';
import { UserActionType } from '../../domain.types/user/user.task/user.task.types';
import { CustomTaskDomainModel } from '../../domain.types/user/custom.task/custom.task.domain.model';
import { CustomTaskService } from '../../services/user/custom.task.service';
import { UserTaskService } from '../../services/user/user.task.service';
import { Loader } from '../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////////

export class CustomTaskHelper {

    _service: CustomTaskService = null;

    _userTaskService: UserTaskService = null;

    constructor() {
        this._service = Loader.container.resolve(CustomTaskService);
        this._userTaskService = Loader.container.resolve(UserTaskService);
    }

    createCustomTask = async (domainModel: CustomTaskDomainModel) => {
        const customTask = await this._service.create(domainModel);
        if (customTask == null) {
            throw new ApiError(400, 'Cannot create custom task!');
        }

        const userTaskModel: UserTaskDomainModel = {
            UserId             : customTask.UserId,
            ActionId           : customTask.id,
            ActionType         : UserActionType.Custom,
            Task               : customTask.Task,
            Description        : customTask.Description,
            ScheduledStartTime : customTask.ScheduledStartTime,
            ScheduledEndTime   : customTask.ScheduledEndTime ?? null,
            Category           : customTask.Category,
            Status             : customTask.Status
        };

        var userTask = await this._userTaskService.create(userTaskModel);
        userTask['Action'] = customTask;
        return userTask;
    };

}

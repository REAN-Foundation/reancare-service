import { ProgressStatus } from '../../../../../../domain.types/miscellaneous/system.types';
import { UserActionType, UserTaskCategory } from '../../../../../../domain.types/users/user.task/user.task.types';
import { UserTaskDto } from '../../../../../../domain.types/users/user.task/user.task.dto';
import UserTask from '../../../models/users/user/user.task.model';
import { getTaskStatus } from './task.helper';

///////////////////////////////////////////////////////////////////////////////////

export class UserTaskMapper {

    static toDto = (task: UserTask): UserTaskDto => {

        if (task == null) {
            return null;
        }

        var status: ProgressStatus = getTaskStatus(task);

        const dto: UserTaskDto = {
            id                   : task.id,
            DisplayId            : task.DisplayId,
            UserId               : task.UserId,
            Task                 : task.Task,
            Description          : task.Description,
            Category             : task.Category as UserTaskCategory,
            ActionType           : task.ActionType as UserActionType,
            ActionId             : task.ActionId,
            ScheduledStartTime   : task.ScheduledStartTime,
            ScheduledEndTime     : task.ScheduledEndTime,
            Status               : status,
            Started              : task.Started,
            StartedAt            : task.StartedAt,
            Finished             : task.Finished,
            FinishedAt           : task.FinishedAt,
            Cancelled            : task.Cancelled,
            CancelledAt          : task.CancelledAt,
            CancellationReason   : task.CancellationReason,
            IsRecurrent          : task.IsRecurrent,
            RecurrenceScheduleId : task.RecurrenceScheduleId,
            CreatedAt            : task.CreatedAt
        };
        return dto;
    };

}

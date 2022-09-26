import { ProgressStatus } from '../../../../../../domain.types/miscellaneous/system.types';
import { UserActionType, UserTaskCategory } from '../../../../../../domain.types/users/user.task/user.task.types';
import { CustomTaskDto } from '../../../../../../domain.types/users/custom.task/custom.task.dto';
import CustomTask from '../../../models/users/user/custom.task.model';
import { getTaskStatus } from './task.helper';

///////////////////////////////////////////////////////////////////////////////////

export class CustomTaskMapper {

    static toDto = (task: CustomTask): CustomTaskDto => {

        if (task == null) {
            return null;
        }

        var status: ProgressStatus = getTaskStatus(task);

        const dto: CustomTaskDto = {
            id                   : task.id,
            UserId               : task.UserId,
            Task                 : task.Task,
            Description          : task.Description,
            Category             : task.Category as UserTaskCategory,
            ActionType           : task.ActionType as UserActionType,
            Details              : task.Details ? JSON.parse(task.Details) : {},
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
        };
        return dto;
    };

}


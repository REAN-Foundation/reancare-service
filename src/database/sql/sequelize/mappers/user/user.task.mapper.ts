import { ProgressStatus } from '../../../../../domain.types/miscellaneous/system.types';
import { UserActionType, UserTaskCategory } from '../../../../../domain.types/user/user.task/user.task..types';
import { UserTaskDto } from '../../../../../domain.types/user/user.task/user.task.dto';
import UserTask from '../../models/user/user.task.model';

///////////////////////////////////////////////////////////////////////////////////

export class UserTaskMapper {

    static toDto = (task: UserTask): UserTaskDto => {

        if (task == null) {
            return null;
        }

        var status: ProgressStatus = ProgressStatus.Unknown;
        if (task.Started === true && task.Finished === true) {
            status = ProgressStatus.Completed;
        }
        if (task.Started === false && task.Finished === false && task.Cancelled === false) {
            if (task.ScheduledEndTime < new Date()) {
                status = ProgressStatus.Delayed;
            }
            else {
                status = ProgressStatus.Pending;
            }
        }
        if (task.Started === true && task.Finished === false) {
            status = ProgressStatus.InProgress;
        }
        if (task.Cancelled === true) {
            status = ProgressStatus.Cancelled;
        }

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
        };
        return dto;
    };

}

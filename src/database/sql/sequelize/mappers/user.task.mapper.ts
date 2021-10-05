import UserTask from '../models/user/user.task.model';
import { UserTaskDto } from '../../../../domain.types/user/user.task/user.task.dto';

///////////////////////////////////////////////////////////////////////////////////

export class UserTaskMapper {

    static toDto = (userTask: UserTask): UserTaskDto => {
        if (userTask == null){
            return null;
        }

        const dto: UserTaskDto = {
            id                   : userTask.id,
            DisplayId            : userTask.DisplayId,
            User                 : null,
            TaskName             : userTask.TaskName,
            Action               : null,
            ScheduledStartTime   : userTask.ScheduledStartTime,
            ScheduledEndTime     : userTask.ScheduledEndTime,
            Started              : userTask.Started,
            StartedAt            : userTask.StartedAt,
            Finished             : userTask.Finished,
            FinishedAt           : userTask.FinishedAt,
            TaskIsSuccess        : userTask.TaskIsSuccess,
            Cancelled            : userTask.Cancelled,
            CancelledAt          : userTask.CancelledAt,
            CancellationReason   : userTask.CancellationReason,
            IsRecurrent          : userTask.IsRecurrent,
            RecurrenceScheduleId : userTask.RecurrenceScheduleId,
        };
        return dto;
    }

}

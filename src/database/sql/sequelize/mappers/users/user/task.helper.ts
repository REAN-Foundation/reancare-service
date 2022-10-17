import { ProgressStatus } from '../../../../../../domain.types/miscellaneous/system.types';

export function getTaskStatus(task: any) {
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
    return status;
}

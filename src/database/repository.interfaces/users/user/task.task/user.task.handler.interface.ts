import { UserTaskMessageDto, ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";

///////////////////////////////////////////////////////////////////////////////

export interface IUserTaskHandler {
    
    processTask(userTask: UserTaskMessageDto, actionData: UserTaskActionData): Promise<ProcessedTaskDto>;
}

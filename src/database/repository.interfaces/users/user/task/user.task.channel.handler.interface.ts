import { UserTaskMessageDto, ProcessedTaskResultDto } from "../../../../../domain.types/users/user.task/user.task.dto";

///////////////////////////////////////////////////////////////////////////////

export interface IUserTaskChannelHandler {
    
    sendMessage(userTask: UserTaskMessageDto, processedResult: ProcessedTaskResultDto): Promise<boolean>;
}



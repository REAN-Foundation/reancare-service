import { UserTaskMessageDto, ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";

///////////////////////////////////////////////////////////////////////////////

export interface IUserTaskChannelHandler {
    
    sendMessage(userTask: UserTaskMessageDto, processedTask: ProcessedTaskDto): Promise<boolean>;
}


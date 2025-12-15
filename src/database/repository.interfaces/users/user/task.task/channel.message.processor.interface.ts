import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";
import { ProcessedTaskDto, UserTaskMessageDto } from "../../../../../domain.types/users/user.task/user.task.dto";

///////////////////////////////////////////////////////////////////////////////

export interface IChannelMessageProcessor {

    processMessage(
        userTask: UserTaskMessageDto,
        actionData: UserTaskActionData,
        rawContent: any
    ): ProcessedTaskDto;

}

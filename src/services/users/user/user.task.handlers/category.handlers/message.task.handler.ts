import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { IUserTaskHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.handler.interface";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { UserTaskActionData } from "../../../../../domain.types/users/user.task/resolved.action.data.types";
import { MessageProcessorFactory as MessageProcessorHandler } from "./message.processors/message.processor.handler";
import { Injector } from "../../../../../startup/injector";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class MessageTaskHandler implements IUserTaskHandler {

    private readonly _messageProcessorHandler: MessageProcessorHandler;

    constructor() {
        this._messageProcessorHandler = Injector.Container.resolve(MessageProcessorHandler);
    }

    async processTask(userTask: UserTaskMessageDto, actionData: UserTaskActionData): Promise<ProcessedTaskDto> {
        try {
            Logger.instance().log(`Processing message task: ${JSON.stringify(userTask)}`);

            const rawContent = actionData?.RawContent ? JSON.parse(actionData.RawContent) : null;
            const processor = this._messageProcessorHandler.getProcessor(userTask.Channel as any);

            return processor.processMessage(userTask, actionData, rawContent);

        } catch (error) {
            Logger.instance().log(`Error processing message task: ${error}`);
            throw error;
        }
    }

}


import { inject, injectable } from "tsyringe";
import * as asyncLib from 'async';
import { Logger } from "../../../common/logger";
import { IUserTaskRepo } from "../../../database/repository.interfaces/users/user/user.task.repo.interface";
import { UserActionType } from "../../../domain.types/users/user.task/user.task.types";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../domain.types/users/user.task/user.task.dto";
import { UserTaskActionData } from "../../../domain.types/users/user.task/resolved.action.data.types";
import { ITaskHandlerResolver } from "../../../database/repository.interfaces/users/user/task.task/user.task.handler.resolver.interface";
import { IChannelHandlerResolver } from "../../../database/repository.interfaces/users/user/task.task/user.task.channel.handler.resolver.interface";
import { IActionHandlerResolver } from "../../../database/repository.interfaces/users/user/task.task/user.task.action.handler.resolver.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

const ASYNC_TASK_COUNT = 4;

@injectable()
export class UserTaskSenderService {

    constructor(
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
        @inject('IActionHandlerResolver') private readonly _actionHandlerResolver: IActionHandlerResolver,
        @inject('ITaskHandlerResolver') private readonly _taskHandlerResolver: ITaskHandlerResolver,
        @inject('IChannelHandlerResolver') private readonly _channelHandlerResolver: IChannelHandlerResolver,
    ) {}

    public _q = asyncLib.queue((timePeriod: number, onCompleted) => {
        (async () => {
            await this.sendUserTasks(timePeriod);
            onCompleted();
        })();
    }, ASYNC_TASK_COUNT);

    public enqueueSendUserTasks = async (timePeriodMin: number) => {
        try {
            this.enqueue(timePeriodMin);
        }
        catch (error) {
            Logger.instance().log(`${JSON.stringify(error.message, null, 2)}`);
        }
    };

    //#region Privates

    private enqueue = (timePeriod: number) => {
        this._q.push(timePeriod, (timePeriod, error) => {
            if (error) {
                Logger.instance().log(`Error sending reminders: ${JSON.stringify(error)}`);
                Logger.instance().log(`Error sending reminders: ${JSON.stringify(error.stack, null, 2)}`);
            }
            else {
                Logger.instance().log(`Sent reminders!`);
            }
        });
    };

    private sendUserTasks = async (timePeriod: number) => {
        try {
            const userTasks = await this._userTaskRepo.getUserTasks(timePeriod);
            if (!userTasks?.length) {
                Logger.instance().log(`No user tasks found for time period: ${timePeriod} minutes`);
                return;
            }

            await this.enrichTasksMetadata(userTasks);
            this.sortTasksBySequence(userTasks);

            for (const userTask of userTasks) {
                try {
                    await this.processUserTask(userTask);
                    await this.timer(300);
                } catch (error) {
                    Logger.instance().log(`Error processing user task ${userTask.id}: ${error}`);
                }
            }
        } catch (error) {
            Logger.instance().log(`Error in sendUserTasks: ${JSON.stringify(error.message, null, 2)}`);
        }
    };

    private async enrichTasksMetadata(userTasks: UserTaskMessageDto[]): Promise<void> {
        for (const userTask of userTasks) {
            if (!userTask.ActionType) {
                userTask.Sequence = 0;
                continue;
            }

            try {
                const actionHandler = this._actionHandlerResolver.getActionHandler(userTask.ActionType as UserActionType);

                if (actionHandler?.enrichTaskMetadata) {
                    await actionHandler.enrichTaskMetadata(userTask);
                } else {
                    userTask.Sequence = 0;
                }
            } catch (error) {
                Logger.instance().log(`Error enriching task metadata for task ${userTask.id}: ${error}`);
                userTask.Sequence = 0;
            }
        }
    }

    private sortTasksBySequence(userTasks: UserTaskMessageDto[]): void {
        userTasks.sort((a, b) => (a.Sequence ?? 0) - (b.Sequence ?? 0));
    }

    private processUserTask = async (userTask: UserTaskMessageDto): Promise<boolean> => {
        try {
            Logger.instance().log(`Processing user task: ${userTask.id}`);

            const actionData = await this.resolveActionData(userTask);
            const processedResult = await this.processTaskWithHandler(userTask, actionData);

            if (!processedResult) {
                return false;
            }

            const isMessageSent = await this.sendMessageViaChannel(userTask, processedResult);

            if (isMessageSent) {
                await this.handleTaskCompletion(userTask);
                return true;
            }

            return false;
        } catch (error) {
            Logger.instance().log(`Error processing user task ${userTask.id}: ${error}`);
            return false;
        }
    };

    private async resolveActionData(userTask: UserTaskMessageDto): Promise<UserTaskActionData> {
        try {
            if (!userTask.ActionId || !userTask.ActionType) {
                return null;
            }

            const actionHandler = this._actionHandlerResolver.getActionHandler(userTask.ActionType as UserActionType);
            if (!actionHandler) {
                return null;
            }

            const actionData = await actionHandler.resolveAction(userTask.ActionType as UserActionType, userTask.ActionId);
            return actionData;
        } catch (error) {
            Logger.instance().log(`Error resolving action for task ${userTask.id}: ${error}`);
            return null;
        }
    }

    private async processTaskWithHandler(userTask: UserTaskMessageDto, actionData: UserTaskActionData):
     Promise<ProcessedTaskDto | null> {
        if (!userTask.Category) {
            Logger.instance().log(`Task category is missing for task ${userTask.id}`);
            return null;
        }

        const taskHandler = this._taskHandlerResolver.getTaskHandler(userTask.Category);
        if (!taskHandler) {
            Logger.instance().log(`No task handler found for category: ${userTask.Category}`);
            return null;
        }

        const processedResult = await taskHandler.processTask(userTask, actionData);

        if (processedResult.Metadata) {
            userTask.Metadata = processedResult.Metadata;
        }

        return processedResult;
    }

    private async sendMessageViaChannel(userTask: UserTaskMessageDto, processedResult: any): Promise<boolean> {
        if (!userTask.Channel) {
            Logger.instance().log(`Task channel is missing for task ${userTask.id}`);
            return false;
        }

        const channelHandler = this._channelHandlerResolver.getChannelHandler(userTask.Channel as any);
        if (!channelHandler) {
            Logger.instance().log(`No channel handler found for channel: ${userTask.Channel}`);
            return false;
        }

        const isMessageSent = await channelHandler.sendMessage(userTask, processedResult);

        if (isMessageSent) {
            Logger.instance().log(`Message sent successfully for task ${userTask.id}`);
        } else {
            Logger.instance().log(`Failed to send message for task ${userTask.id}`);
        }

        return isMessageSent;
    }

    private async handleTaskCompletion(userTask: UserTaskMessageDto): Promise<void> {
        try {
            const taskHandler = this._taskHandlerResolver.getTaskHandler(userTask.Category);

            if (!taskHandler) {
                Logger.instance().log(`No task handler found for completion check: ${userTask.Category}`);
                return;
            }

            const shouldAutoFinish = taskHandler.shouldAutoFinish();

            if (shouldAutoFinish) {
                await this.finishTask(userTask);
            } else {
                Logger.instance().log(`Task ${userTask.id} will not auto-finish (requires user interaction)`);
            }

        } catch (error) {
            Logger.instance().log(`Error handling task completion for ${userTask.id}: ${error}`);
        }
    }

    private async finishTask(userTask: UserTaskMessageDto): Promise<void> {
        await this._userTaskRepo.finishTask(userTask.id);

        if (userTask.ActionType && userTask.ActionId) {
            try {
                const actionHandler = this._actionHandlerResolver.getActionHandler(userTask.ActionType as UserActionType);

                if (actionHandler?.onTaskCompleted) {
                    await actionHandler.onTaskCompleted(userTask.id, userTask.ActionId);
                }
            } catch (error) {
                Logger.instance().log(`Error in action completion callback for task ${userTask.id}: ${error}`);
            }
        }
    }

    private timer = ms => new Promise(res => setTimeout(res, ms));

}

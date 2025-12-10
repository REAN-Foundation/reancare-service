import { inject, injectable } from "tsyringe";
import * as asyncLib from 'async';
import { Logger } from "../../../common/logger";
import { IUserTaskRepo } from "../../../database/repository.interfaces/users/user/user.task.repo.interface";
import { UserActionType, UserTaskCategory } from "../../../domain.types/users/user.task/user.task.types";
import { ICareplanRepo } from "../../../database/repository.interfaces/clinical/careplan.repo.interface";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../domain.types/users/user.task/user.task.dto";
import { UserTaskActionData } from "../../../domain.types/users/user.task/resolved.action.data.types";
import { UserActionResolver } from "./user.action.resolver";
import { UserTaskCategoryResolver } from "./user.task.category.resolver";
import { UserTaskChannelResolver } from "./user.task.channel.resolver";

////////////////////////////////////////////////////////////////////////////////////////////////////////

const ASYNC_TASK_COUNT = 4;

@injectable()
export class UserTaskSenderService {

    private readonly _actionResolver: UserActionResolver = null;

    private readonly _categoryResolver: UserTaskCategoryResolver = null;

    private readonly _channelResolver: UserTaskChannelResolver = null;

    constructor(
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
        @inject('ICareplanRepo') private _careplanRepo: ICareplanRepo,
    ) {
        this._actionResolver = new UserActionResolver();
        this._categoryResolver = new UserTaskCategoryResolver();
        this._channelResolver = new UserTaskChannelResolver();
    }

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

            await this.populateTaskMetadata(userTasks);
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

    private async populateTaskMetadata(userTasks: UserTaskMessageDto[]): Promise<void> {
        for (const userTask of userTasks) {
            userTask.Sequence = 0;
            userTask.Language = 'en';

            if (!userTask.ActionId || !userTask.ActionType) {
                continue;
            }

            try {
                const actionData = await this._actionResolver.getAction(userTask.ActionType, userTask.ActionId);
                userTask.Sequence = actionData?.Sequence ?? 0;
                userTask.Language = actionData?.Language ?? 'en';
            } catch (error) {
                Logger.instance().log(`Error resolving action metadata for task ${userTask.id}: ${error}`);
            }
        }
    }

    private sortTasksBySequence(userTasks: UserTaskMessageDto[]): void {
        userTasks.sort((a, b) => (a.Sequence ?? 0) - (b.Sequence ?? 0));
    }

    private readonly processUserTask = async (userTask: UserTaskMessageDto): Promise<boolean> => {
        try {
            Logger.instance().log(`Processing user task: ${userTask.id}`);

            const actionData = await this.resolveActionData(userTask);
            const processedResult = await this.processTaskWithHandler(userTask, actionData);
            
            if (!processedResult) {
                return false;
            }

            const isMessageSent = await this.sendMessageViaChannel(userTask, processedResult);
            
            if (isMessageSent) {
                if (this.shouldFinishTaskAfterMessageSent(userTask.Category)) {
                    await this.finishTask(userTask);
                }
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

            const actionData = await this._actionResolver.getAction(userTask.ActionType, userTask.ActionId);
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

        const processedResult = await this._categoryResolver.processTask(
            userTask.Category,
            userTask,
            actionData
        );

        if (!processedResult) {
            Logger.instance().log(`No task handler found for category: ${userTask.Category}`);
            return null;
        }

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

        const isMessageSent = await this._channelResolver.sendMessage(
            userTask.Channel as any,
            userTask,
            processedResult
        );

        if (isMessageSent) {
            Logger.instance().log(`Message sent successfully for task ${userTask.id}`);
        } else {
            Logger.instance().log(`Failed to send message for task ${userTask.id}`);
        }

        return isMessageSent;
    }

    private async finishTask(userTask: UserTaskMessageDto): Promise<void> {
        await this._userTaskRepo.finishTask(userTask.id);

        if (userTask.ActionType === UserActionType.Careplan && userTask.ActionId) {
            try {
                await this._careplanRepo.completeActivity(userTask.ActionId);
                Logger.instance().log(`Careplan activity completed for task ${userTask.id}`);
            } catch (error) {
                Logger.instance().log(`Error completing careplan activity for task ${userTask.id}: ${error}`);
            }
        }
    }

    private shouldFinishTaskAfterMessageSent(category: UserTaskCategory | string): boolean {
        if (!category) {
            return true;
        }
        if (category === UserTaskCategory.Assessment) {
            return false;
        }

        return true;
    }

    private timer = ms => new Promise(res => setTimeout(res, ms));

}

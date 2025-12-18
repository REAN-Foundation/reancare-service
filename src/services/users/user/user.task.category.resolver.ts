import { UserTaskCategory } from "../../../domain.types/users/user.task/user.task.types";
import { IUserTaskHandler } from "../../../database/repository.interfaces/users/user/task.task/user.task.handler.interface";
import { Injector } from "../../../startup/injector";
import { AssessmentTaskHandler } from "./user.task.handlers/category.handlers/assessment.task.handler";
import { MessageTaskHandler } from "./user.task.handlers/category.handlers/message.task.handler";
import { UserTaskMessageDto, ProcessedTaskDto } from "../../../domain.types/users/user.task/user.task.dto";
import { UserTaskActionData } from "../../../domain.types/users/user.task/resolved.action.data.types";
import { Logger } from "../../../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class UserTaskCategoryResolver {

    processTask = async (
        category: UserTaskCategory,
        userTask: UserTaskMessageDto,
        actionData: UserTaskActionData
    ): Promise<ProcessedTaskDto | null> => {
        const taskHandler = this.getTaskHandler(category);
        if (!taskHandler) {
            Logger.instance().log(`No task handler found for category: ${category}`);
            return null;
        }
        return await taskHandler.processTask(userTask, actionData);
    };

    getTaskHandler(category: UserTaskCategory): IUserTaskHandler {
        try {
            switch (category) {
                case UserTaskCategory.Assessment:
                    return Injector.Container.resolve(AssessmentTaskHandler);
                
                case UserTaskCategory.Message:
                    return Injector.Container.resolve(MessageTaskHandler);
                
                    // Add more handlers as needed
                    // case UserTaskCategory.Medication:
                    //     return Injector.Container.resolve(MedicationTaskHandler);
                
                default:
                    Logger.instance().log(`No handler found for task category: ${category}`);
                    return null;
            }
        } catch (error) {
            Logger.instance().log(`Error getting task handler for category ${category}: ${error}`);
            return null;
        }
    }

    //#endregion

}

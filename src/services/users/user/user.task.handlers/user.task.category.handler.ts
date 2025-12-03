import { Logger } from "../../../../common/logger";
import { Injector } from "../../../../startup/injector";
import { UserTaskCategory } from "../../../../domain.types/users/user.task/user.task.types";
import { IUserTaskHandler } from "../../../../database/repository.interfaces/users/user/task.task/user.task.handler.interface";
import { AssessmentTaskHandler } from "./category.handlers/assessment.task.handler";
import { MessageTaskHandler } from "./category.handlers/message.task.handler";

///////////////////////////////////////////////////////////////////////////////

export class UserTaskHandler {

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

}


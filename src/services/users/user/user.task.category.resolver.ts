import { UserTaskCategory } from "../../../domain.types/users/user.task/user.task.types";
import { IUserTaskHandler } from "../../../database/repository.interfaces/users/user/task.task/user.task.handler.interface";
import { Injector } from "../../../startup/injector";
import { AssessmentTaskHandler } from "./user.task.handlers/category.handlers/assessment.task.handler";
import { MessageTaskHandler } from "./user.task.handlers/category.handlers/message.task.handler";
import { MedicationTaskHandler } from "./user.task.handlers/category.handlers/medication.task.handler";
import { AppointmentTaskHandler } from "./user.task.handlers/category.handlers/appointment.task.handler";
import { ExerciseTaskHandler } from "./user.task.handlers/category.handlers/exercise.task.handler";
import { NutritionTaskHandler } from "./user.task.handlers/category.handlers/nutrition.task.handler";
import { BiometricsTaskHandler } from "./user.task.handlers/category.handlers/biometrics.task.handler";
import { GoalTaskHandler } from "./user.task.handlers/category.handlers/goal.task.handler";
import { ChallengeTaskHandler } from "./user.task.handlers/category.handlers/challenge.task.handler";
import { ConsultationTaskHandler } from "./user.task.handlers/category.handlers/consultation.task.handler";
import { PersonalReflectionTaskHandler } from "./user.task.handlers/category.handlers/personal.reflection.task.handler";
import { StressManagementTaskHandler } from "./user.task.handlers/category.handlers/stress.management.task.handler";
import { FitnessRecordTaskHandler } from "./user.task.handlers/category.handlers/fitness.record.task.handler";
import { EducationalVideoTaskHandler } from "./user.task.handlers/category.handlers/educational.video.task.handler";
import { EducationalAudioTaskHandler } from "./user.task.handlers/category.handlers/educational.audio.task.handler";
import { EducationalAnimationTaskHandler } from "./user.task.handlers/category.handlers/educational.animation.task.handler";
import { EducationalLinkTaskHandler } from "./user.task.handlers/category.handlers/educational.link.task.handler";
import { EducationalInfographicTaskHandler } from "./user.task.handlers/category.handlers/educational.infographic.task.handler";
import { EducationalNewsFeedTaskHandler } from "./user.task.handlers/category.handlers/educational.newsfeed.task.handler";
import { CustomTaskHandler } from "./user.task.handlers/category.handlers/custom.task.handler";
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

                case UserTaskCategory.Medication:
                    return Injector.Container.resolve(MedicationTaskHandler);

                case UserTaskCategory.Appointment:
                    return Injector.Container.resolve(AppointmentTaskHandler);

                case UserTaskCategory.Exercise:
                    return Injector.Container.resolve(ExerciseTaskHandler);

                case UserTaskCategory.Nutrition:
                    return Injector.Container.resolve(NutritionTaskHandler);

                case UserTaskCategory.Biometrics:
                    return Injector.Container.resolve(BiometricsTaskHandler);

                case UserTaskCategory.Goal:
                    return Injector.Container.resolve(GoalTaskHandler);

                case UserTaskCategory.Challenge:
                    return Injector.Container.resolve(ChallengeTaskHandler);

                case UserTaskCategory.Consultation:
                    return Injector.Container.resolve(ConsultationTaskHandler);

                case UserTaskCategory.PersonalReflection:
                    return Injector.Container.resolve(PersonalReflectionTaskHandler);

                case UserTaskCategory.StressManagement:
                    return Injector.Container.resolve(StressManagementTaskHandler);

                case UserTaskCategory.FitnessRecord:
                    return Injector.Container.resolve(FitnessRecordTaskHandler);

                case UserTaskCategory.EducationalVideo:
                    return Injector.Container.resolve(EducationalVideoTaskHandler);

                case UserTaskCategory.EducationalAudio:
                    return Injector.Container.resolve(EducationalAudioTaskHandler);

                case UserTaskCategory.EducationalAnimation:
                    return Injector.Container.resolve(EducationalAnimationTaskHandler);

                case UserTaskCategory.EducationalLink:
                    return Injector.Container.resolve(EducationalLinkTaskHandler);

                case UserTaskCategory.EducationalInfographics:
                    return Injector.Container.resolve(EducationalInfographicTaskHandler);

                case UserTaskCategory.EducationalNewsFeed:
                    return Injector.Container.resolve(EducationalNewsFeedTaskHandler);

                case UserTaskCategory.Custom:
                    return Injector.Container.resolve(CustomTaskHandler);

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

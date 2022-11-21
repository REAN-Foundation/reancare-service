import { ProgressStatus, uuid } from "../../../../domain.types/miscellaneous/system.types";
import { UserLearningDto } from "../../../../domain.types/educational/learning/user.learning/user.learning.dto";

export interface IUserLearningRepo {

    updateUserLearning (
        userId: uuid,
        contentId: uuid,
        learningPathId?: uuid,
        courseId?: uuid,
        moduleId?: uuid,
        actionId?: uuid,
        progressStatus?: ProgressStatus,
        progressPercentage?: number,): Promise<UserLearningDto>;

    getUserLearning(userId: uuid, contentId: uuid): Promise<UserLearningDto>;

    searchUserLearnings(userId: uuid, searchFilters: any): Promise<any[]>;
    searchUserLearningsForLearningPath(userId: uuid, learningPathId: uuid): Promise<UserLearningDto[]>;
    searchUserLearningsForCourse(userId: uuid, courseId: uuid): Promise<UserLearningDto[]>;
    searchUserLearningsForModule(userId: uuid, moduleId: uuid): Promise<UserLearningDto[]>;

}

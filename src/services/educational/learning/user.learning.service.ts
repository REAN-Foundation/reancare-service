import { ProgressStatus, uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IUserLearningRepo } from "../../../database/repository.interfaces/educational/learning/user.learning.repo.interface";
import { UserLearningDto } from '../../../domain.types/educational/learning/user.learning/user.learning.dto';
import { ICourseContentRepo } from "../../../database/repository.interfaces/educational/learning/course.content.repo.interface";
import { ICourseModuleRepo } from "../../../database/repository.interfaces/educational/learning/course.module.repo.interface";
import { ICourseRepo } from "../../../database/repository.interfaces/educational/learning/course.repo.interface";
import { ILearningPathRepo } from "../../../database/repository.interfaces/educational/learning/learning.path.repo.interface";
import { ApiError } from "../../../common/api.error";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserLearningService {

    constructor(
        @inject('IUserLearningRepo') private _userLearningRepo: IUserLearningRepo,
        @inject('ICourseContentRepo') private _contentRepo: ICourseContentRepo,
        @inject('ICourseModuleRepo') private _moduleRepo: ICourseModuleRepo,
        @inject('ICourseRepo') private _courseRepo: ICourseRepo,
        @inject('ILearningPathRepo') private _learningPathRepo: ILearningPathRepo,
    ) {}

    updateUserLearning = async (
        userId: uuid,
        contentId: uuid,
        actionId?: uuid,
        learningPathId?: uuid,
        courseId?: uuid,
        moduleId?: uuid,
        progressStatus?: ProgressStatus,
        progressPercentage?: number,):
    Promise<UserLearningDto> =>
    {
        const content = await this._contentRepo.getById(contentId);
        if (!content) {
            throw new ApiError(404, 'Course content cannot be retrieved.');
        }
        if (!moduleId) {
            moduleId = content.ModuleId;
        }
        if (!courseId) {
            courseId = content.CourseId;
        }
        if (!learningPathId) {
            learningPathId = content.LearningPathId;
        }
        if (!progressStatus) {
            progressStatus = ProgressStatus.InProgress;
        }
        if (!progressPercentage) {
            progressPercentage = 100;
        }
        return await this._userLearningRepo.updateUserLearning(
            userId, contentId, learningPathId, courseId, moduleId, actionId, progressStatus, progressPercentage);
    };

    getLearningPathProgress = async (userId: uuid, learningPathId: uuid): Promise<number> => {
        const userLearnings = await this._userLearningRepo.searchUserLearningsForLearningPath(userId, learningPathId);
        if (userLearnings.length === 0) {
            return 0;
        }
        const contents = [];
        const courses = await this._courseRepo.getCoursesForLearningPath(learningPathId);
        for await (var course of courses) {
            const modules = await this._moduleRepo.getModulesForCourse(course.id);
            for await (var module of modules) {
                const contents_ = await this._contentRepo.GetContentsForModule(module.id);
                contents.push(...contents_);
            }
        }
        if (contents.length === 0) {
            return 0;
        }
        let numerator = 0;
        const denominator = contents.length;
        for (const content of contents) {
            const foundUserLearning = userLearnings.find(x => x.ContentId === content.id);
            if (foundUserLearning) {
                numerator += (foundUserLearning.PercentageCompletion / 100);
            }
        }
        return numerator / denominator;
    };

    getCourseProgress = async (userId: uuid, courseId: uuid): Promise<number> => {
        const modules = await this._moduleRepo.getModulesForCourse(courseId);
        if (modules.length === 0) {
            return 0;
        }
        let numerator = 0;
        const denominator = modules.length;
        for await (const module of modules) {
            numerator += await this.getModuleProgress(userId, module.id);
        }
        return numerator / denominator;
    };

    getModuleProgress = async (userId: uuid, moduleId: uuid): Promise<number> => {
        const userLearnings = await this._userLearningRepo.searchUserLearningsForModule(userId, moduleId);
        if (userLearnings.length === 0) {
            return 0;
        }
        const contents = await this._contentRepo.GetContentsForModule(moduleId);
        if (contents.length === 0) {
            return 0;
        }
        let numerator = 0;
        const denominator = contents.length;
        for (const content of contents) {
            const foundUserLearning = userLearnings.find(x => x.ContentId === content.id);
            if (foundUserLearning) {
                numerator += (foundUserLearning.PercentageCompletion / 100);
            }
        }
        return numerator / denominator;
    };

    getContentProgress = async (userId: uuid, contentId: uuid): Promise<number> => {
        const userLearning = await this._userLearningRepo.getUserLearning(userId, contentId);
        if (userLearning) {
            return userLearning.PercentageCompletion;
        }
        return 0;
    };

    getUserCourseContents = async (userId: string, learningPathId?: uuid): Promise<any[]> => {
        const filters = learningPathId ? {
            LearningPathId : learningPathId
        } : null;
        const userLearnings = await this._userLearningRepo.searchUserLearnings(userId, filters);
        if (userLearnings.length === 0) {
            return [];
        }
        const userCourseContents = userLearnings.map(x => {
            return {
                UserId               : x.UserId,
                ContentId            : x.ContentId,
                CourseId             : x.CourseId,
                ModuleId             : x.ModuleId,
                LearningPathId       : x.LearningPathId,
                Content              : x.Content,
                ContentType          : x.Content?.ContentType,
                StartedAt            : x.CreatedAt,
                LastAccessedAt       : x.UpdatedAt,
                ProgressStatus       : x.ProgressStatus,
                PercentageCompletion : x.PercentageCompletion,
            };
        });
        return userCourseContents;
    };

    getUserLearningPaths = async (userId: string): Promise<any[]> => {
        const userLearnings = await this._userLearningRepo.searchUserLearnings(userId, null);
        if (userLearnings.length === 0) {
            return [];
        }
        const uniqueLearningPaths = [...new Set(userLearnings.map(x => x.LearningPathId))];
        const userLearningPaths = [];
        for await (const lpId of uniqueLearningPaths) {
            const learningPath = await this._learningPathRepo.getById(lpId);
            userLearningPaths.push(learningPath);
        }
        return userLearningPaths;
    };

}

import { ProgressStatus, uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { UserLearningDto } from "../../../../../../domain.types/educational/learning/user.learning/user.learning.dto";
import { IUserLearningRepo } from '../../../../../repository.interfaces/educational/learning/user.learning.repo.interface';
import { UserLearningMapper } from '../../../mappers/educational/learning/user.learning.mapper';
import UserLearning from '../../../models/educational/learning/user.learning.model';

///////////////////////////////////////////////////////////////////////

export class UserLearningRepo implements IUserLearningRepo {

    updateUserLearning = async (
        userId: uuid,
        contentId: uuid,
        learningPathId?: uuid,
        courseId?: uuid,
        moduleId?: uuid,
        progressStatus?: ProgressStatus,
        progressPercentage?: number,
    ):
    Promise<UserLearningDto> => {
        try {

            const existing = await UserLearning.findOne({
                where : {
                    UserId    : userId,
                    ContentId : contentId
                }
            });
            if (existing) {
                if (progressStatus) {
                    existing.ProgressStatus = progressStatus;
                }
                if (progressPercentage) {
                    existing.PercentageCompletion = progressPercentage;
                }
                await existing.save();
            }
            const entity = {
                LearningPathId       : learningPathId,
                CourseId             : courseId,
                UserId               : userId ,
                ModuleId             : moduleId,
                ContentId            : contentId   ,
                ProgressStatus       : ProgressStatus.InProgress,
                PercentageCompletion : progressPercentage ?? 100,
            };

            const learning = await UserLearning.create(entity);
            return UserLearningMapper.toDto(learning);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUserLearning = async (userId: uuid, contentId: uuid): Promise<UserLearningDto> => {
        try {
            var learning = await UserLearning.findOne({
                where : {
                    UserId    : userId,
                    ContentId : contentId
                }
            });
            return UserLearningMapper.toDto(learning);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    searchUserLearnings = async (userId: string): Promise<any[]> => {
        try {
            var learnings = await UserLearning.findAll({
                where : {
                    UserId : userId,
                }
            });
            return learnings;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    searchUserLearningsForLearningPath = async (userId: string, learningPathId: string): Promise<UserLearningDto[]> => {
        try {
            var learnings = await UserLearning.findAll({
                where : {
                    UserId         : userId,
                    LearningPathId : learningPathId
                }
            });
            return learnings.map(x => UserLearningMapper.toDto(x));
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    searchUserLearningsForCourse = async (userId: string, courseId: string): Promise<UserLearningDto[]> => {
        try {
            var learnings = await UserLearning.findAll({
                where : {
                    UserId   : userId,
                    CourseId : courseId
                }
            });
            return learnings.map(x => UserLearningMapper.toDto(x));
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

    searchUserLearningsForModule = async (userId: string, moduleId: string): Promise<UserLearningDto[]> => {
        try {
            var learnings = await UserLearning.findAll({
                where : {
                    UserId   : userId,
                    ModuleId : moduleId
                }
            });
            return learnings.map(x => UserLearningMapper.toDto(x));
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    }

}

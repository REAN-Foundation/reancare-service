import express from 'express';
import { ProgressStatus, uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { UserLearningService } from '../../../../services/educational/learning/user.learning.service';
import { Loader } from '../../../../startup/loader';
import { UserLearningValidator } from './user.learning.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class UserLearningController extends BaseController {

    //#region member variables and constructors

    _service: UserLearningService = null;

    _validator: UserLearningValidator = new UserLearningValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(UserLearningService);
    }

    //#endregion

    //#region Action methods

    updateUserLearning = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('UserLearning.UpdateUserLearning', request, response);
            const model = await this._validator.updateUserLearning(request);

            const userLearning = await this._service.updateUserLearning(
                model.UserId,
                model.ContentId,
                model.ActionId ?? null,
                model.LearningPathId ?? null,
                model.CourseId ?? null,
                model.ModuleId ?? null,
                model.ProgressStatus ?? ProgressStatus.InProgress,
                model.PercentageCompletion ?? 100);
            if (userLearning == null) {
                throw new ApiError(400, 'Can not update user learning!');
            }
            ResponseHandler.success(request, response, 'User learning updated successfully!', 201, {
                courseContent : userLearning,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getLearningPathProgress = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('UserLearning.GetCourseProgress', request, response);
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const learningPathId: uuid = await this._validator.getParamUuid(request, 'learningPathId');
            const progress = await this._service.getLearningPathProgress(userId, learningPathId);
            if (progress == null) {
                throw new ApiError(404, 'Learning path progress cannot be retrieved.');
            }
            ResponseHandler.success(request, response, 'Learning path progress retrieved successfully!', 200, {
                LearningPathProgress : progress,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getCourseProgress = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('UserLearning.GetCourseProgress', request, response);
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const courseId: uuid = await this._validator.getParamUuid(request, 'courseId');
            const progress = await this._service.getCourseProgress(userId, courseId);
            if (progress == null) {
                throw new ApiError(404, 'Course progress cannot be retrieved.');
            }
            ResponseHandler.success(request, response, 'Course progress retrieved successfully!', 200, {
                CourseProgress : progress,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getModuleProgress = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('UserLearning.GetModuleProgress', request, response);
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const moduleId: uuid = await this._validator.getParamUuid(request, 'moduleId',);
            const progress = await this._service.getModuleProgress(userId, moduleId);
            if (progress == null) {
                throw new ApiError(404, 'Course module progress cannot be retrieved.');
            }
            ResponseHandler.success(request, response, 'Course module progress retrieved successfully!', 200, {
                CourseModule : progress,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getContentProgress = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('UserLearning.GetContentProgress', request, response);
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const contentId: uuid = await this._validator.getParamUuid(request, 'contentId');
            const progress = await this._service.getContentProgress(userId, contentId);
            if (progress == null) {
                throw new ApiError(404, 'Course content progress cannot be retrieved.');
            }
            ResponseHandler.success(request, response, 'Course content progress retrieved successfully!', 200, {
                ContentProgress : progress,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUserLearningPaths = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('UserLearning.GetUserLearningPaths', request, response);
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const paths = await this._service.getUserLearningPaths(userId);
            if (paths == null) {
                throw new ApiError(404, 'User learning paths cannot be retrieved.');
            }
            for await (var path of paths) {
                const percentageCompletion = await this._service.getLearningPathProgress(userId, path.id);
                path['PercentageCompletion'] = percentageCompletion;
            }
            ResponseHandler.success(request, response, 'User learning paths retrieved successfully!', 200, {
                UserLearningPaths : paths,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUserCourseContents = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('UserLearning.GetUserCourseContents', request, response);
            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const learningPathId: uuid = request.query['learningPathId'] as string ?? null;
            const contents = await this._service.getUserCourseContents(userId, learningPathId);
            if (contents == null) {
                throw new ApiError(404, 'User course contents cannot be retrieved.');
            }
            for await (var content of contents) {
                const percentageCompletion = await this._service.getContentProgress(userId, content.ContentId);
                content['PercentageCompletion'] = percentageCompletion;
            }
            ResponseHandler.success(request, response, 'User course contents retrieved successfully!', 200, {
                UserCourseContents : contents,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

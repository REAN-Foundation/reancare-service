import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { CourseContentService } from '../../../../services/educational/learning/course.content.service';
import { Loader } from '../../../../startup/loader';
import { CourseContentValidator } from './course.content.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class CourseContentController extends BaseController {

    //#region member variables and constructors

    _service: CourseContentService = null;

    _validator: CourseContentValidator = new CourseContentValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(CourseContentService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('CourseContent.Create', request, response);

            const model = await this._validator.create(request);
            const courseContent = await this._service.create(model);
            if (courseContent == null) {
                throw new ApiError(400, 'Can not create course content!');
            }

            ResponseHandler.success(request, response, 'Course content created successfully!', 201, {
                CourseContent : courseContent,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('CourseContent.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const courseContent = await this._service.getById(id);
            if (courseContent == null) {
                throw new ApiError(404, 'Course content not found.');
            }

            ResponseHandler.success(request, response, 'Course content retrieved successfully!', 200, {
                CourseContent : courseContent,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('CourseContent.Search', request, response);
            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} course contents retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                CourseContents : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('CourseContent.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Course content not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update course content!');
            }

            ResponseHandler.success(request, response, 'Course content updated successfully!', 200, {
                CourseContent : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('CourseContent.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Course content not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Course content cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Course content deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getContentsForCourse = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('CourseContent.GetContentsForCourse', request, response);
            const courseId: uuid = await this._validator.getParamUuid(request, 'courseId');
            const courseContents = await this._service.getContentsForCourse(courseId);
            if (courseContents == null) {
                throw new ApiError(404, 'Course contents not found.');
            }
            ResponseHandler.success(request, response, 'Course contents for course retrieved successfully!', 200, {
                CourseContents : courseContents,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getContentsForLearningPath = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('CourseContent.GetContentsForLearningPath', request, response);
            const learningPathId: uuid = await this._validator.getParamUuid(request, 'learningPathId');
            const courseContents = await this._service.getContentsForLearningPath(learningPathId);
            if (courseContents == null) {
                throw new ApiError(404, 'Course contents not found.');
            }
            ResponseHandler.success(request, response, 'Course contents for learning path retrieved successfully!', 200, {
                CourseContents : courseContents,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

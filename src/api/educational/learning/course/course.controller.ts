import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { CourseService } from '../../../../services/educational/learning/course.service';
import { Loader } from '../../../../startup/loader';
import { CourseValidator } from './course.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class CourseController extends BaseController {

    //#region member variables and constructors

    _service: CourseService = null;

    _validator: CourseValidator = new CourseValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(CourseService);

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Course.Create', request, response);

            const model = await this._validator.create(request);

            const course = await this._service.create(model);
            if (course == null) {
                throw new ApiError(400, 'Cannot create course!');
            }

            ResponseHandler.success(request, response, 'Course created successfully!', 201, {
                Course : course,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Course.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const course = await this._service.getById(id);
            if (course == null) {
                throw new ApiError(404, 'Course not found.');
            }

            ResponseHandler.success(request, response, 'Course retrieved successfully!', 200, {
                Course : course,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Course.Search', request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} courses retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Courses : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Course.Update', request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Course not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update course!');
            }

            ResponseHandler.success(request, response, 'Course updated successfully!', 200, {
                Course : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Course.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Course not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Course cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Course deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

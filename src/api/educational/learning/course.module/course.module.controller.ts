import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { CourseModuleService } from '../../../../services/educational/learning/course.module.service';
import { Loader } from '../../../../startup/loader';
import { CourseModuleValidator } from './course.module.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class CourseModuleController extends BaseController {

    //#region member variables and constructors

    _service: CourseModuleService = null;

    _validator: CourseModuleValidator = new CourseModuleValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(CourseModuleService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('CourseModule.Create', request, response);

            const model = await this._validator.create(request);
            const courseModule = await this._service.create(model);
            if (courseModule == null) {
                throw new ApiError(400, 'Can not create course module!');
            }

            ResponseHandler.success(request, response, 'Course module created successfully!', 201, {
                CourseModule : courseModule,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('CourseModule.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const courseModule = await this._service.getById(id);
            if (courseModule == null) {
                throw new ApiError(404, 'Course module not found.');
            }

            ResponseHandler.success(request, response, 'Course module retrieved successfully!', 200, {
                CourseModule : courseModule,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('CourseModule.Search', request, response);
            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} course modules retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                CourseModules : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('CourseModule.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Course module not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update course module!');
            }

            ResponseHandler.success(request, response, 'Course module updated successfully!', 200, {
                CourseModule : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('CourseModule.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Course module not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Course module cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Course module deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { LearningPathService } from '../../../../services/educational/learning/learning.path.service';
import { Loader } from '../../../../startup/loader';
import { LearningPathValidator } from './learning.path.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class LearningPathController extends BaseController {

    //#region member variables and constructors

    _service: LearningPathService = null;

    _validator: LearningPathValidator = new LearningPathValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(LearningPathService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('LearningPath.Create', request, response);

            const model = await this._validator.create(request);

            const learningPath = await this._service.create(model);
            if (learningPath == null) {
                throw new ApiError(400, 'Cannot create learningPath.!');
            }

            ResponseHandler.success(request, response, 'Learning path created successfully!', 201, {
                LearningPath : learningPath,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('LearningPath.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const learningPath = await this._service.getById(id);
            if (learningPath == null) {
                throw new ApiError(404, 'Learning path not found.');
            }

            ResponseHandler.success(request, response, 'Learning path retrieved successfully!', 200, {
                LearningPath : learningPath,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('LearningPath.Search', request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} learning paths retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                LearningPaths : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('LearningPath.Update', request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Learning path not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update learningPath!');
            }

            ResponseHandler.success(request, response, 'Learning path updated successfully!', 200, {
                LearningPath : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('LearningPath.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Learning path not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Learning path cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Learning path deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

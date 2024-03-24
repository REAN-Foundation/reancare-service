import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { LearningPathService } from '../../../../services/educational/learning/learning.path.service';
import { Injector } from '../../../../startup/injector';
import { LearningPathValidator } from './learning.path.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class LearningPathController {

    //#region member variables and constructors

    _service: LearningPathService = Injector.Container.resolve(LearningPathService);

    _validator: LearningPathValidator = new LearningPathValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

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

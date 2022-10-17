import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { KnowledgeNuggetService } from '../../../services/educational/knowledge.nugget.service';
import { Loader } from '../../../startup/loader';
import { KnowledgeNuggetValidator } from './knowledge.nugget.validator';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class KnowledgeNuggetController extends BaseController {

    //#region member variables and constructors

    _service: KnowledgeNuggetService = null;

    _validator: KnowledgeNuggetValidator = new KnowledgeNuggetValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(KnowledgeNuggetService);

    }

    //#endregion

    //#region Action methods

    getTodaysTopic = async(request: express.Request, response: express.Response) => {
        try {
            await this.setContext('KnowledgeNugget.GetTodaysTopic', request, response);

            const patientUserId = await this._validator.getParamUuid(request, 'patientUserId');

            const nugget = await this._service.getTodaysTopic(patientUserId);
            if (nugget == null) {
                throw new ApiError(400, 'Cannot create record for knowledge nugget!');
            }

            ResponseHandler.success(request, response, 'Knowledge nugget record created successfully!', 200, {
                KnowledgeNugget : nugget,
            });
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('KnowledgeNugget.Create', request, response);

            const domainModel = await this._validator.create(request);

            const knowledgeNugget = await this._service.create(domainModel);
            if (knowledgeNugget == null) {
                throw new ApiError(400, 'Cannot create record for knowledge nugget!');
            }

            ResponseHandler.success(request, response, 'Knowledge nugget record created successfully!', 201, {
                KnowledgeNugget : knowledgeNugget,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('KnowledgeNugget.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const knowledgeNugget = await this._service.getById(id);
            if (knowledgeNugget == null) {
                throw new ApiError(404, ' Knowledge nugget record not found.');
            }

            ResponseHandler.success(request, response, 'Knowledge nugget record retrieved successfully!', 200, {
                KnowledgeNugget : knowledgeNugget,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('KnowledgeNugget.Search', request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} knowledge Nugget records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                KnowledgeNuggetRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('KnowledgeNugget.Update', request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'KnowledgeNugget record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update knowledge nugget record!');
            }

            ResponseHandler.success(request, response, 'Knowledge nugget record updated successfully!', 200, {
                KnowledgeNugget : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('KnowledgeNugget.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Knowledge nugget record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Knowledge nugget record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Knowledge nugget record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

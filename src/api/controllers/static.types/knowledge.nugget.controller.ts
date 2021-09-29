import express from 'express';
import { ResponseHandler } from '../../../common/response.handler';
import { Loader } from '../../../startup/loader';
import { ApiError } from '../../../common/api.error';
import { KnowledgeNuggetService } from '../../../services/static.types/knowledge.nugget.service';
import { Authorizer } from '../../../auth/authorizer';
import { KnowledgeNuggetValidator } from '../../validators/static.types/knowledge.nugget.validator';
import { Helper } from '../../../common/helper';

///////////////////////////////////////////////////////////////////////////////////////

export class KnowledgeNuggetController {

    //#region member variables and constructors

    _service: KnowledgeNuggetService = null;

    _authorizer: Authorizer = null;

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(KnowledgeNuggetService);
        this._authorizer = Loader.authorizer;

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'StaticTypes.KnowledgeNugget.Create';

            const knowledgeNuggetDomainModel = await KnowledgeNuggetValidator.create(request);

            const KnowledgeNugget = await this._service.create(knowledgeNuggetDomainModel);
            if (KnowledgeNugget == null) {
                throw new ApiError(400, 'Cannot create record for knowledge nugget!');
            }

            ResponseHandler.success(request, response, 'Knowledge nugget record created successfully!', 201, {
                KnowledgeNugget : KnowledgeNugget,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'StaticTypes.KnowledgeNugget.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await KnowledgeNuggetValidator.getById(request);

            const KnowledgeNugget = await this._service.getById(id);
            if (KnowledgeNugget == null) {
                throw new ApiError(404, ' Knowledge nugget record not found.');
            }

            ResponseHandler.success(request, response, 'Knowledge nugget record retrieved successfully!', 200, {
                KnowledgeNugget : KnowledgeNugget,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'StaticTypes.KnowledgeNugget.Search';
            await this._authorizer.authorize(request, response);

            const filters = await KnowledgeNuggetValidator.search(request);

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
            request.context = 'StaticTypes.KnowledgeNugget.Update';

            await this._authorizer.authorize(request, response);

            const domainModel = await KnowledgeNuggetValidator.update(request);

            const id: string = await KnowledgeNuggetValidator.getById(request);
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
            request.context = 'StaticTypes.KnowledgeNugget.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await KnowledgeNuggetValidator.getById(request);
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

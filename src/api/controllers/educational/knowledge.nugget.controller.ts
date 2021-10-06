import express from 'express';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { Helper } from '../../../common/helper';
import { ResponseHandler } from '../../../common/response.handler';
import { KnowledgeNuggetService } from '../../../services/educational/knowledge.nugget.service';
import { Loader } from '../../../startup/loader';
import { KnowledgeNuggetValidator } from '../../validators/educational/knowledge.nugget.validator';

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

    getTodaysTopic = async(request: express.Request, response: express.Response) => {
        try {
            request.context = 'KnowledgeNugget.GetTodaysTopic';

            const patientUserId = await KnowledgeNuggetValidator.getPatientUserId(request);
    
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
    }

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'KnowledgeNugget.Create';

            const domainModel = await KnowledgeNuggetValidator.create(request);

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
            request.context = 'KnowledgeNugget.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await KnowledgeNuggetValidator.getById(request);

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
            request.context = 'KnowledgeNugget.Search';
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
            request.context = 'KnowledgeNugget.Update';

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
            request.context = 'KnowledgeNugget.Delete';
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

import express from 'express';

import { Helper } from '../../../../common/helper';
import { ResponseHandler } from '../../../../common/response.handler';
import { Loader } from '../../../../startup/loader';
import { Authorizer } from '../../../../auth/authorizer';

import { ApiError } from '../../../../common/api.error';
import { SymptomValidator } from '../../../validators/clinical/symptom/symptom.validator';
import { SymptomService } from '../../../../services/clinical/symptom/symptom.service';


///////////////////////////////////////////////////////////////////////////////////////

export class SymptomController {

    //#region member variables and constructors

    _service: SymptomService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(SymptomService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Symptom.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await SymptomValidator.create(request);

            const address = await this._service.create(domainModel);
            if (address == null) {
                throw new ApiError(400, 'Cannot create address!');
            }

            ResponseHandler.success(request, response, 'Symptom created successfully!', 201, {
                Symptom : address,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Symptom.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await SymptomValidator.getById(request);

            const address = await this._service.getById(id);
            if (address == null) {
                throw new ApiError(404, 'Symptom not found.');
            }

            ResponseHandler.success(request, response, 'Symptom retrieved successfully!', 200, {
                Symptom : address,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Symptom.Search';
            await this._authorizer.authorize(request, response);

            const filters = await SymptomValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} address records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { Symptomes: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Symptom.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await SymptomValidator.update(request);

            const id: string = await SymptomValidator.getById(request);
            const existingSymptom = await this._service.getById(id);
            if (existingSymptom == null) {
                throw new ApiError(404, 'Symptom not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update address record!');
            }

            ResponseHandler.success(request, response, 'Symptom record updated successfully!', 200, {
                Symptom : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Symptom.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await SymptomValidator.getById(request);
            const existingSymptom = await this._service.getById(id);
            if (existingSymptom == null) {
                throw new ApiError(404, 'Symptom not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Symptom cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Symptom record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

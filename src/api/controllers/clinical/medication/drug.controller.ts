import express from 'express';
import { Authorizer } from '../../../../auth/authorizer';
import { ApiError } from '../../../../common/api.error';
import { Helper } from '../../../../common/helper';
import { ResponseHandler } from '../../../../common/response.handler';
import { DrugService } from '../../../../services/clinical/medication/drug.service';
import { Loader } from '../../../../startup/loader';
import { DrugValidator } from '../../../validators/clinical/medication/drug.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class DrugController {

    //#region member variables and constructors

    _service: DrugService = null;

    _authorizer: Authorizer = null;

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(DrugService);
        this._authorizer = Loader.authorizer;

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Medication.Drug.Create';

            const drugDomainModel = await DrugValidator.create(request);

            const Drug = await this._service.create(drugDomainModel);
            if (Drug == null) {
                throw new ApiError(400, 'Cannot create record for drug!');
            }

            ResponseHandler.success(request, response, 'Drug record created successfully!', 201, {
                Drug : Drug,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Medication.Drug.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await DrugValidator.getById(request);

            const Drug = await this._service.getById(id);
            if (Drug == null) {
                throw new ApiError(404, ' Drug record not found.');
            }

            ResponseHandler.success(request, response, 'Drug record retrieved successfully!', 200, {
                Drug : Drug,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Medication.Drug.Search';
            await this._authorizer.authorize(request, response);

            const filters = await DrugValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} drug records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                DrugRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Medication.Drug.Update';

            await this._authorizer.authorize(request, response);

            const domainModel = await DrugValidator.update(request);

            const id: string = await DrugValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Drug record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update drug record!');
            }

            ResponseHandler.success(request, response, 'Drug record updated successfully!', 200, {
                Drug : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Medication.Drug.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await DrugValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Drug record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Drug record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Drug record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

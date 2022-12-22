import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { DrugService } from '../../../../services/clinical/medication/drug.service';
import { Loader } from '../../../../startup/loader';
import { DrugValidator } from './drug.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class DrugController extends BaseController{

    //#region member variables and constructors

    _service: DrugService = null;

    _validator: DrugValidator = new DrugValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(DrugService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Medication.Drug.Create', request, response);

            const model = await this._validator.create(request);
            const drug = await this._service.create(model);
            if (drug == null) {
                throw new ApiError(400, 'Cannot create record for drug!');
            }

            ResponseHandler.success(request, response, 'Drug record created successfully!', 201, {
                Drug : drug,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Medication.Drug.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const drug = await this._service.getById(id);
            if (drug == null) {
                throw new ApiError(404, 'Drug record not found.');
            }

            ResponseHandler.success(request, response, 'Drug record retrieved successfully!', 200, {
                Drug : drug,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Medication.Drug.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} drug records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                Drugs : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Medication.Drug.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
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

            await this.setContext('Medication.Drug.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
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

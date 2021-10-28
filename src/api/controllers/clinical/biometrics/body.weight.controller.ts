import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { BodyWeightService } from '../../../../services/clinical/biometrics/body.weight.service';
import { Loader } from '../../../../startup/loader';
import { BodyWeightValidator } from '../../../validators/clinical/biometrics/body.weight.validator';
import { BaseController } from '../../base.controller';
import { Logger } from '../../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyWeightController extends BaseController {

    //#region member variables and constructors

    _service: BodyWeightService = null;

    _validator: BodyWeightValidator = new BodyWeightValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(BodyWeightService);
    }
    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('Biometrics.BodyWeight.Create', request, response);

            const model = await this._validator.create(request);
            const bodyWeight = await this._service.create(model);
            if (bodyWeight == null) {
                throw new ApiError(400, 'Cannot create weight record!');
            }

            ResponseHandler.success(request, response, 'Weight record created successfully!', 201, {
                BodyWeight : bodyWeight,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('Biometrics.BodyWeight.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const bodyWeight = await this._service.getById(id);
            if (bodyWeight == null) {
                throw new ApiError(404, 'Weight record not found.');
            }

            ResponseHandler.success(request, response, 'Weight record retrieved successfully!', 200, {
                BodyWeight : bodyWeight,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('Biometrics.BodyWeight.Search', request, response);

            const filters = await this._validator.search(request);

            Logger.instance().log(`afre validation: ${JSON.stringify(filters)}`);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} weight records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { BodyWeightRecords: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('Biometrics.BodyWeight.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Weight record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update weight record!');
            }

            ResponseHandler.success(request, response, 'Weight record updated successfully!', 200, {
                BodyWeight : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            this.setContext('Biometrics.BodyWeight.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Weight record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Weight record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Weight record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    //#endregion

}

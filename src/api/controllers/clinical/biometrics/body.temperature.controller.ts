import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { BodyTemperatureService } from '../../../../services/clinical/biometrics/body.temperature.service';
import { Loader } from '../../../../startup/loader';
import { BodyTemperatureValidator } from '../../../validators/clinical/biometrics/body.temperature.validator';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyTemperatureController extends BaseController {

    //#region member variables and constructors

    _service: BodyTemperatureService = null;

    _validator: BodyTemperatureValidator = new BodyTemperatureValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(BodyTemperatureService);

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Biometrics.BodyTemperature.Create', request, response);

            const model = await this._validator.create(request);
            const bodyTemperature = await this._service.create(model);
            if (bodyTemperature == null) {
                throw new ApiError(400, 'Cannot create record for body temperature!');
            }

            ResponseHandler.success(request, response, 'Body temperature record created successfully!', 201, {
                BodyTemperature : bodyTemperature,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('Biometrics.BodyTemperature.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const bodyTemperature = await this._service.getById(id);
            if (bodyTemperature == null) {
                throw new ApiError(404, 'Body temperature record not found.');
            }

            ResponseHandler.success(request, response, 'Body temperature record retrieved successfully!', 200, {
                BodyTemperature : bodyTemperature,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('Biometrics.BodyTemperature.Search', request, response);

            const filters = await this._validator.search(request);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} body temperature records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                BodyTemperatureRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('Biometrics.BodyTemperature.Update', request, response);

            const domainModel = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Body temperature record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update body temperature record!');
            }

            ResponseHandler.success(request, response, 'Body temperature record updated successfully!', 200, {
                BodyTemperature : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('Biometrics.BodyTemperature.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Body temperature record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Body temperature record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Body temperature record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

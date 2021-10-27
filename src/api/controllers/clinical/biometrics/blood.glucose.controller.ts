import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ResponseHandler } from '../../../../common/response.handler';
import { BloodGlucoseService } from '../../../../services/clinical/biometrics/blood.glucose.service';
import { Loader } from '../../../../startup/loader';
import { BloodGlucoseValidator } from '../../../validators/clinical/biometrics/blood.glucose.validator';
import { BaseController } from '../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodGlucoseController extends BaseController {

    //#region member variables and constructors
    _service: BloodGlucoseService = null;

    _validator: BloodGlucoseValidator = new BloodGlucoseValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(BloodGlucoseService);

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            this.setContext('Biometrics.BloodGlucose.Create', request, response);

            const bloodGlucoseDomainModel = await this._validator.create(request);

            const bloodGlucose = await this._service.create(bloodGlucoseDomainModel);
            if (bloodGlucose == null) {
                throw new ApiError(400, 'Cannot create record for Blood Glucose!');
            }

            ResponseHandler.success(request, response, 'Blood Glucose record created successfully!', 201, {
                BloodGlucose : bloodGlucose,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            this.setContext('Biometrics.BloodGlucose.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const bloodGlucose = await this._service.getById(id);
            if (bloodGlucose == null) {
                throw new ApiError(404, ' Blood Glucose record not found.');
            }

            ResponseHandler.success(request, response, 'Blood Glucose record retrieved successfully!', 200, {
                BloodGlucose : bloodGlucose,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            this.setContext('Biometrics.BloodGlucose.Search', request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} Blood Glucose records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                BloodGlucoseRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            this.setContext('Biometrics.BloodGlucose.Update', request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood Glucose record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update Blood Glucose record!');
            }

            ResponseHandler.success(request, response, 'Blood Glucose record updated successfully!', 200, {
                BloodGlucose : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            this.setContext('Biometrics.BloodGlucose.Delete', request, response);

            const id: string = await this._validator.getParamUuid(request, 'id');
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood Glucose record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Blood Glucose record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Blood Glucose record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

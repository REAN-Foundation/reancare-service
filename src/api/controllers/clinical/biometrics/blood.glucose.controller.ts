import express from 'express';
import { Authorizer } from '../../../../auth/authorizer';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { BloodGlucoseService } from '../../../../services/clinical/biometrics/blood.glucose.service';
import { Loader } from '../../../../startup/loader';
import { BloodGlucoseValidator } from '../../../validators/clinical/biometrics/blood.glucose.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class BloodGlucoseController {

    //#region member variables and constructors
    _service: BloodGlucoseService = null;

    _authorizer: Authorizer = null;

    _personService: any;

    constructor() {
        this._service = Loader.container.resolve(BloodGlucoseService);
        this._authorizer = Loader.authorizer;

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BloodGlucose.Create';

            const bloodGlucoseDomainModel = await BloodGlucoseValidator.create(request);

            const bloodGlucose = await this._service.create(bloodGlucoseDomainModel);
            if (bloodGlucose == null) {
                throw new ApiError(400, 'Cannot create record for blood glucose!');
            }

            ResponseHandler.success(request, response, 'Blood glucose record created successfully!', 201, {
                BloodGlucose : bloodGlucose,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BloodGlucose.GetById';
            
            await this._authorizer.authorize(request, response);

            const id: string = await BloodGlucoseValidator.getById(request);

            const BloodGlucose = await this._service.getById(id);
            if (BloodGlucose == null) {
                throw new ApiError(404, ' Blood glucose record not found.');
            }

            ResponseHandler.success(request, response, 'Blood glucose record retrieved successfully!', 200, {
                BloodGlucose : BloodGlucose,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BloodGlucose.Search';
            await this._authorizer.authorize(request, response);

            const filters = await BloodGlucoseValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} blood glucose records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, {
                BloodGlucoseRecords : searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BloodGlucose.Update';

            await this._authorizer.authorize(request, response);

            const domainModel = await BloodGlucoseValidator.update(request);

            const id: string = await BloodGlucoseValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood glucose record not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update blood glucose record!');
            }

            ResponseHandler.success(request, response, 'Blood glucose record updated successfully!', 200, {
                BloodGlucose : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Biometrics.BloodGlucose.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await BloodGlucoseValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'Blood glucose record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Blood glucose record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Blood glucose record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

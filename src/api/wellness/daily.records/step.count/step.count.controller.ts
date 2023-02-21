import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { PatientService } from '../../../../services/users/patient/patient.service';
import { StepCountService } from '../../../../services/wellness/daily.records/step.count.service';
import { Loader } from '../../../../startup/loader';
import { StepCountValidator } from './step.count.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class StepCountController extends BaseController {

    //#region member variables and constructors

    _service: StepCountService = null;

    _validator: StepCountValidator = new StepCountValidator();

    _patientService: PatientService = null;

    constructor() {
        super();
        this._service = Loader.container.resolve(StepCountService);
        this._patientService = Loader.container.resolve(PatientService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('DailyRecords.StepCount.Create', request, response);

            const domainModel = await this._validator.create(request);
            const recordDate = request.body.RecordDate;
        
            var existingRecord = await this._service.getByRecordDate(recordDate);
            if (existingRecord !== null) {
                var stepCount = await this._service.update(existingRecord.id, domainModel);
            } else {
                var stepCount = await this._service.create(domainModel);
            }

            if (stepCount == null) {
                throw new ApiError(400, 'Cannot create Step Count!');
            }

            ResponseHandler.success(request, response, 'Step count created successfully!', 201, {
                StepCount : stepCount,

            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('DailyRecords.StepCount.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const stepCount = await this._service.getById(id);
            if (stepCount == null) {
                throw new ApiError(404, 'Step Count not found.');
            }

            ResponseHandler.success(request, response, 'Step Count retrieved successfully!', 200, {
                StepCount : stepCount,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('DailyRecords.StepCount.Search', request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} Step Count records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { StepCountRecords: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('DailyRecords.StepCount.Update', request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingStepCount = await this._service.getById(id);
            if (existingStepCount == null) {
                throw new ApiError(404, 'Step Count not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update Step ount record!');
            }

            ResponseHandler.success(request, response, 'Step Count record updated successfully!', 200, {
                StepCount : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('DailyRecords.StepCount.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingStepCount = await this._service.getById(id);
            if (existingStepCount == null) {
                throw new ApiError(404, 'Step Count not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Step Count cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Step Count record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

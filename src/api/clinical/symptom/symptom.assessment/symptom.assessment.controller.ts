import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { SymptomAssessmentService } from '../../../../services/clinical/symptom/symptom.assessment.service';
import { Loader } from '../../../../startup/loader';
import { SymptomAssessmentValidator } from './symptom.assessment.validator';
import { BaseController } from '../../../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentController extends BaseController {

    //#region member variables and constructors

    _service: SymptomAssessmentService = null;

    _validator: SymptomAssessmentValidator = new SymptomAssessmentValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(SymptomAssessmentService);

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('SymptomAssessment.Create', request, response);

            const domainModel = await this._validator.create(request);

            const assessment = await this._service.create(domainModel);
            if (assessment == null) {
                throw new ApiError(400, 'Cannot create assessment!');
            }

            ResponseHandler.success(request, response, 'Symptom assessment created successfully!', 201, {
                SymptomAssessment : assessment,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('SymptomAssessment.GetById', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const assessment = await this._service.getById(id);
            if (assessment == null) {
                throw new ApiError(404, 'Symptom assessment not found.');
            }

            ResponseHandler.success(request, response, 'Symptom assessment retrieved successfully!', 200, {
                SymptomAssessment : assessment,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('SymptomAssessment.Search', request, response);

            const filters = await this._validator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} assessment records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { SymptomAssessments: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('SymptomAssessment.Update', request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingSymptomAssessment = await this._service.getById(id);
            if (existingSymptomAssessment == null) {
                throw new ApiError(404, 'Symptom assessment not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update assessment record!');
            }

            ResponseHandler.success(request, response, 'Symptom assessment record updated successfully!', 200, {
                SymptomAssessment : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('SymptomAssessment.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingSymptomAssessment = await this._service.getById(id);
            if (existingSymptomAssessment == null) {
                throw new ApiError(404, 'Symptom assessment not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Symptom assessment cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Symptom assessment record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}

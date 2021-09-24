import express from 'express';

import { Helper } from '../../../../common/helper';
import { ResponseHandler } from '../../../../common/response.handler';
import { Loader } from '../../../../startup/loader';
import { Authorizer } from '../../../../auth/authorizer';

import { ApiError } from '../../../../common/api.error';
import { SymptomAssessmentValidator } from '../../../validators/clinical/symptom/symptom.assessment.validator';
import { SymptomAssessmentService } from '../../../../services/clinical/symptom/symptom.assessment.service';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomAssessmentController {

    //#region member variables and constructors

    _service: SymptomAssessmentService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(SymptomAssessmentService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'SymptomAssessment.Create';
            await this._authorizer.authorize(request, response);
            
            const domainModel = await SymptomAssessmentValidator.create(request);

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
            request.context = 'SymptomAssessment.GetById';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const id: string = await SymptomAssessmentValidator.getById(request);

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
            request.context = 'SymptomAssessment.Search';
            await this._authorizer.authorize(request, response);

            const filters = await SymptomAssessmentValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} assessment records retrieved successfully!`;
                    
            ResponseHandler.success(request, response, message, 200, { SymptomAssessmentes: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'SymptomAssessment.Update';
            await this._authorizer.authorize(request, response);

            const domainModel = await SymptomAssessmentValidator.update(request);

            const id: string = await SymptomAssessmentValidator.getById(request);
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
            request.context = 'SymptomAssessment.Delete';
            await this._authorizer.authorize(request, response);

            const id: string = await SymptomAssessmentValidator.getById(request);
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

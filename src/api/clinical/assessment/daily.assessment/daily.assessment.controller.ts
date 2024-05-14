import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { DailyAssessmentService } from '../../../../services/clinical/daily.assessment/daily.assessment.service';
import { DailyAssessmentValidator } from './daily.assessment.validator';
import { Injector } from '../../../../startup/injector';
import { PatientService } from '../../../../services/users/patient/patient.service';
import { EHRHowDoYouFeelService } from '../../../../modules/ehr.analytics/ehr.services/ehr.how.do.you.feel.service';
import { DailyAssessmentDomainModel } from '../../../../domain.types/clinical/daily.assessment/daily.assessment.domain.model';
import { BaseController } from '../../../../api/base.controller';
import { DailyAssessmentSearchFilters } from '../../../../domain.types/clinical/daily.assessment/daily.assessment.search.types';
import { PermissionHandler } from '../../../../auth/custom/permission.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class DailyAssessmentController extends BaseController {

    //#region member variables and constructors

    _service: DailyAssessmentService = Injector.Container.resolve(DailyAssessmentService);

    _patientService: PatientService = Injector.Container.resolve(PatientService);

    _ehrHowDoYouFeelService: EHRHowDoYouFeelService = Injector.Container.resolve(EHRHowDoYouFeelService);

    _validator: DailyAssessmentValidator = new DailyAssessmentValidator();

    constructor() {
        super();
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
            await this.authorizeOne(request, model.PatientUserId, null);
            const dailyAssessment: DailyAssessmentDomainModel = await this._service.create(model);

            if (dailyAssessment == null) {
                throw new ApiError(400, 'Cannot create record for daily assessment!');
            }

            await this._ehrHowDoYouFeelService.addEHRDailyAssessmentForAppNames(dailyAssessment);

            ResponseHandler.success(request, response, 'Daily assessment record created successfully!', 201, {
                DailyAssessment : dailyAssessment,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            let filters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} daily assessment records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { DailyAssessmentRecords: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion


    //#region Authorization

    authorizeSearch = async (
        request: express.Request,
        searchFilters: DailyAssessmentSearchFilters): Promise<DailyAssessmentSearchFilters> => {

        const currentUser = request.currentUser;

        if (searchFilters.PatientUserId != null) {
            if (searchFilters.PatientUserId !== request.currentUser.UserId) {
                const hasConsent = await PermissionHandler.checkConsent(
                    searchFilters.PatientUserId,
                    currentUser.UserId,
                    request.context
                );
                if (!hasConsent) {
                    throw new ApiError(403, `Unauthorized`);
                }
            }
        }
        else {
            searchFilters.PatientUserId = currentUser.UserId;
        }
        return searchFilters;
    };

    //#endregion

}

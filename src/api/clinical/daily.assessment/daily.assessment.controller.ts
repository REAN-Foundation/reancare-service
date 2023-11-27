import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { DailyAssessmentService } from '../../../services/clinical/daily.assessment/daily.assessment.service';
import { Loader } from '../../../startup/loader';
import { DailyAssessmentValidator } from './daily.assessment.validator';
import { BaseController } from '../../base.controller';
import { PatientService } from '../../../services/users/patient/patient.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { EHRAnalyticsHandler } from '../../../modules/ehr.analytics/ehr.analytics.handler';
import { Logger } from '../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class DailyAssessmentController extends BaseController{

    //#region member variables and constructors

    _service: DailyAssessmentService = null;

    _validator: DailyAssessmentValidator = new DailyAssessmentValidator();

    _patientService: PatientService = null;

    _ehrAnalyticsHandler: EHRAnalyticsHandler = null;

    constructor() {
        super();
        this._service = Loader.container.resolve(DailyAssessmentService);
        this._patientService = Loader.container.resolve(PatientService);
        this._ehrAnalyticsHandler = Loader.container.resolve(EHRAnalyticsHandler);

    }
    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyAssessment.Create', request, response);

            const model = await this._validator.create(request);
            const dailyAssessment = await this._service.create(model);

            if (dailyAssessment == null) {
                throw new ApiError(400, 'Cannot create record for daily assessment!');
            }
            // get user details to add records in ehr database
            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(dailyAssessment.PatientUserId);
            if (eligibleAppNames.length > 0) {
                for await (var appName of eligibleAppNames) { 
                    this._service.addEHRRecord(model.PatientUserId, dailyAssessment.id, null, model, appName);
                }
            } else {
                Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${dailyAssessment.PatientUserId}`);
            }

            ResponseHandler.success(request, response, 'Daily assessment record created successfully!', 201, {
                DailyAssessment : dailyAssessment,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('DailyAssessment.Search', request, response);

            const filters = await this._validator.search(request);
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

}

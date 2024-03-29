import express from 'express';
import { UserDeviceDetailsService } from '../../../services/users/user/user.device.details.service';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { UserService } from '../../../services/users/user/user.service';
import { Logger } from '../../../common/logger';
import { CustomActionsHandler } from '../../../custom/custom.actions.handler';
import { CommonActions } from '../../../custom/common/common.actions';
import { AssessmentTemplateService } from '../../../services/clinical/assessment/assessment.template.service';
import { Injector } from '../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class TestController {

    //#region member variables and constructors

    _userService: UserService = null;

    _assessmentTemplateService: AssessmentTemplateService = null;

    _userDeviceDetailsService: UserDeviceDetailsService = null;

    constructor() {
        this._userService = Injector.Container.resolve(UserService);
        this._userDeviceDetailsService = Injector.Container.resolve(UserDeviceDetailsService);
        this._assessmentTemplateService = Injector.Container.resolve(AssessmentTemplateService);
    }

    //#endregion

    scheduleMonthlyCustomTasks = async (request: express.Request, response: express.Response): Promise<any> => {
        try {

            Logger.instance().log('Testing: Schedule Custom Tasks...');

            var customActionHandler = new CustomActionsHandler();
            await customActionHandler.scheduledMonthlyRecurrentTasks();

            ResponseHandler.success(request, response, 'Cron completed successfully!', 200);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    createAssessmentTask = async (request: express.Request, response: express.Response): Promise<any> => {
        try {

            Logger.instance().log('Testing: Creating custom assessment task...');

            const patientUserId = request.params.patientUserId;
            const templateId = request.params.templateId;
            const template = await this._assessmentTemplateService.getById(templateId);
            const templateName = template.Title;

            var commonActions = new CommonActions();
            const assessment = await commonActions.createAssessmentTask(patientUserId, templateName);

            ResponseHandler.success(request, response, 'Assessment created successfully!', 200, {
                Assessment : assessment,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    testReportGeneration = async (request: express.Request, response: express.Response): Promise<any> => {
        try {

            Logger.instance().log('Testing: Generating assessment report...');

            const patientUserId = request.params.patientUserId;
            const assessmentId = request.params.assessmentId;
            const score = request.body.Score;

            var customActionHandler = new CustomActionsHandler();
            const result = await customActionHandler.performActions_GenerateAssessmentReport(
                patientUserId, assessmentId, score);

            ResponseHandler.success(request, response, 'Assessment created successfully!', 200, {
                Result : result,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}

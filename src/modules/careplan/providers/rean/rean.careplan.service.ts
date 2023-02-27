/* eslint-disable @typescript-eslint/no-unused-vars */
import { ICareplanService } from "../../interfaces/careplan.service.interface";
import needle = require('needle');
import { Logger } from '../../../../common/logger';
import { ApiError } from "../../../../common/api.error";
import { injectable } from "tsyringe";
import { EnrollmentDomainModel } from "../../../../domain.types/clinical/careplan/enrollment/enrollment.domain.model";
import { CareplanActivity } from "../../../../domain.types/clinical/careplan/activity/careplan.activity";
import { ParticipantDomainModel } from "../../../../domain.types/clinical/careplan/participant/participant.domain.model";
import { ProgressStatus } from "../../../../domain.types/miscellaneous/system.types";
import {
    CAssessmentTemplate,
} from '../../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentService } from "../../../../services/clinical/assessment/assessment.service";
import { Loader } from '../../../../startup/loader';
import { UserTaskService } from '../../../../services/users/user/user.task.service';
import { AssessmentTemplateRepo } from '../../../../database/sql/sequelize/repositories/clinical/assessment/assessment.template.repo';
import { TimeHelper } from "../../../../common/time.helper";
import { DurationType } from "../../../../domain.types/miscellaneous/time.types";
import { ActionPlanDto } from "../../../../domain.types/users/patient/action.plan/action.plan.dto";
import { GoalDto } from "../../../../domain.types/users/patient/goal/goal.dto";
import { HealthPriorityDto } from "../../../../domain.types/users/patient/health.priority/health.priority.dto";
import { CareplanRepo } from "../../../../database/sql/sequelize/repositories/clinical/careplan/careplan.repo";
import { CareplanService } from "../../../../services/clinical/careplan.service";

//////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ReanCareplanService implements ICareplanService {

    _assessmentService: AssessmentService = null;

    _userTaskService: UserTaskService = null;

    _assessmentTemplateRepo: AssessmentTemplateRepo = null;

    _careplanRepo: CareplanRepo = null;

    _careplanService: CareplanService = null;

    constructor() {
        this._assessmentService = Loader.container.resolve(AssessmentService);
        this._userTaskService = Loader.container.resolve(UserTaskService);
        this._assessmentTemplateRepo = Loader.container.resolve(AssessmentTemplateRepo);
        this._careplanRepo = Loader.container.resolve(CareplanRepo);
        this._careplanService = Loader.container.resolve(CareplanService);
    }

    public providerName(): string {
        return "REAN";
    }

    //#region Publics

    public init = async (): Promise<boolean> => {

        var headers = {
            'Content-Type'    : 'application/json',
            'x-api-key'       : process.env.CAREPLAN_API_KEY,
            Accept            : '*/*',
            'Cache-Control'   : 'no-cache',
            'Accept-Encoding' : 'gzip, deflate, br',
            Connection        : 'keep-alive',
        };

        var options = {
            headers : headers
        };

        var url = process.env.CAREPLAN_API_BASE_URL;

        var response = await needle('get', url, options);
        if (response.statusCode === 200) {
            Logger.instance().log('Successfully connected to REAN Careplan API service!');
            return true;
        } else {
            Logger.instance().error('Unable to connect REAN Careplan API service!', response.statusCode, null);
            return false;
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getPatientEligibility = async (user: any, planCode: string) => {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return new Promise((resolve, reject) => {
            const patientBirthDate : Date = user.Person.BirthDate;
            const dateTurned18 = TimeHelper.addDuration(patientBirthDate, 18, DurationType.Year);
            var isBefore = TimeHelper.isBefore(dateTurned18, new Date());
            if (isBefore || planCode !== 'Cholesterol') {
                resolve({
                    Eligible : true
                });
            }
            else {
                resolve({
                    Eligible : false,
                    Reason   : `Sorry, you are too young to register.`
                });
            }
        });
    };

    public registerPatient = async (patientDetails: ParticipantDomainModel): Promise<string> => {

        const entity = {
            ParticipantReferenceId : patientDetails.PatientUserId,
            FirstName              : patientDetails.Name.split(' ')[0],
            LastName               : patientDetails.Name.split(' ')[1],
            Gender                 : patientDetails.Gender,
            CountryCode            : patientDetails.Phone.split('-')[0],
            Phone                  : patientDetails.Phone.split('-')[1],
        };

        var url = process.env.CAREPLAN_API_BASE_URL + '/participants';
        var headerOptions = await this.getHeaderOptions();
        var response = await needle('post', url, entity, headerOptions);

        if (response.statusCode !== 201) {
            Logger.instance().log(`ResponseCode: ${response.statusCode}, Body: ${JSON.stringify(response.body.error)}`);
            throw new ApiError(500, 'Rean Careplan participant service error: ' + response.body.error);
        }

        return response.body.Data.id;
    };

    public enrollPatientToCarePlan = async (model: EnrollmentDomainModel): Promise<string> => {

        const enrollmentData : EnrollmentDomainModel = {
            ParticipantId  : model.ParticipantId,
            PlanCode       : model.PlanCode,
            StartDate      : new Date(model.StartDateStr),
            EndDate        : TimeHelper.addDuration(model.StartDate,240,DurationType.Day),
            EnrollmentDate : new Date(),
            WeekOffset     : model.WeekOffset,
            DayOffset      : model.DayOffset
        };

        var url = process.env.CAREPLAN_API_BASE_URL + '/enrollments';
        var headerOptions = await this.getHeaderOptions();
        var response = await needle('post', url, enrollmentData, headerOptions);

        if (response.statusCode !== 201) {
            Logger.instance().log(`ResponseCode: ${response.statusCode}, Body: ${JSON.stringify(response.body.error)}`);
            throw new ApiError(500, 'Rean Careplan enrollment service error: ' + response.body.error);
        }
        enrollmentData.EnrollmentId = response.body.Data.id;
        enrollmentData.PlanName = model.PlanName;

        Logger.instance().log(`response body: ${JSON.stringify(response.body)}`);

        return response.body.Data.id;
    };

    public fetchActivities = async (

        careplanCode: string, enrollmentId: string,
        participantId: string ): Promise<CareplanActivity[]> => {

        const careplanApiBaseUrl = process.env.CAREPLAN_API_BASE_URL;
        const url = `${careplanApiBaseUrl}/enrollment-tasks/search?enrollmentId=${enrollmentId}`;
        const headerOptions = await this.getHeaderOptions();
        var response = await needle("get", url, headerOptions);

        if (response.statusCode !== 200) {
            Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
            Logger.instance().error('Unable to fetch tasks for given participant id!', response.statusCode, null);
            throw new ApiError(500, "Rean careplan fetching task service error: " + response.body.error.message);
        }

        Logger.instance().log(`response body for activities: ${JSON.stringify(response.body.Data.Items.length)}`);

        var activities = response.body.Data.Items;
        var activityEntities: CareplanActivity[] = [];

        activities.forEach(async activity => {

            const templateVariables = { Variables: activity.Asset.TemplateVariables };

            var entity: CareplanActivity = {
                ParticipantId          : activity.ParticipantId,
                EnrollmentId           : activity.EnrollmentId,
                Provider               : this.providerName(),
                ProviderActionId       : activity.id,
                Title                  : activity.Asset.Name,
                Type                   : activity.Asset.TemplateName,
                PlanCode               : activity.Asset.AssetCode,
                Description            : JSON.stringify(templateVariables),
                Language               : 'English',
                ScheduledAt            : activity.ScheduledDate,
                TimeSlot               : activity.TimeSlot,
                IsRegistrationActivity : activity.IsRegistrationActivity
            };

            activityEntities.push(entity);

        });

        return activityEntities;

    };

    scheduleDailyHighRiskCareplan = async (): Promise<void> => {

        const enrollments = await this._careplanRepo.getAllCareplanEnrollment();
        Logger.instance().log(`Number of enrollments retrived ${enrollments.length}.`);

        if (enrollments.length !== 0) {
            enrollments.forEach(async enrollment => {

                if (enrollment.HasHighRisk) {
                    const deletedCount = await this._careplanRepo.deleteFutureCareplanTask(enrollment);

                    if (deletedCount > 0) {
                        const enrollmentData : EnrollmentDomainModel = {
                            Provider       : "REAN",
                            PatientUserId  : enrollment.PatientUserId,
                            ParticipantId  : enrollment.ParticipantId,
                            PlanName       : "High Risk Maternity Careplan",
                            PlanCode       : "Maternity-High-Risk",
                            StartDateStr   : new Date(enrollment.StartAt).toString(),
                            StartDate      : new Date(enrollment.StartAt),
                            EndDate        : TimeHelper.addDuration(new Date(enrollment.StartAt),240, DurationType.Day),
                            EnrollmentDate : new Date(),
                            WeekOffset     : 0,
                            DayOffset      : 0
                        };

                        const enrollmentDto = await this._careplanService.enrollAndCreateTask(enrollmentData);
                        Logger.instance().log(`Enrollment for high risk careplan: ${enrollmentDto}`);

                    } else {
                        Logger.instance().log(`Not able to switch from normal to high risk careplan`);
                    }

                    enrollment.HasHighRisk = false ;
                    await this._careplanRepo.updateRisk( enrollment);

                }
            });
        } else {
            Logger.instance().log(`No enrollments fetched from careplan task.`);
        }

    };

    //#endregion

    //#region Goals, priorities and action plans

    private async getHeaderOptions() {

        var headers = {
            'Content-Type' : 'application/json',
            'x-api-key'    : process.env.CAREPLAN_API_KEY,
            accept         : 'application/json'
        };

        return {
            headers : headers,
        };
    }

    private getActivityStatus(status: string) {
        if (status === "PENDING") {
            return ProgressStatus.Pending;
        }
        else if (status === "COMPLETED") {
            return ProgressStatus.Completed;
        }
        else {
            return ProgressStatus.Unknown;
        }
    }

    getActivity(patientUserId: string, careplanCode: string,
        enrollmentId: string | number, activityId: string, scheduledAt?: string): Promise<CareplanActivity> {
        throw new Error("Method not implemented.");
    }

    completeActivity(patientUserId: string, careplanCode: string,
        enrollmentId: string | number, activityId: string, updates: any): Promise<CareplanActivity> {
        throw new Error("Method not implemented.");
    }

    convertToAssessmentTemplate(assessmentActivity: CareplanActivity): Promise<CAssessmentTemplate> {
        throw new Error("Method not implemented.");
    }

    getGoals(patientUserId: string, enrollmentId: string, category: string): Promise<GoalDto[]> {
        throw new Error("Method not implemented.");
    }

    getActionPlans(patientUserId: string, enrollmentId: string, category: string): Promise<ActionPlanDto[]> {
        throw new Error("Method not implemented.");
    }

    updateActionPlan(enrollmentId: string, actionName: string): Promise<ActionPlanDto> {
        throw new Error("Method not implemented.");
    }

    updateGoal(enrollmentId: string, goalName: string): Promise<GoalDto> {
        throw new Error("Method not implemented.");
    }

    updateHealthPriority(patientUserId: string,
        enrollmentId: string, healthPriorityType: string): Promise<HealthPriorityDto> {
        throw new Error("Method not implemented.");
    }

    //#endregion

}

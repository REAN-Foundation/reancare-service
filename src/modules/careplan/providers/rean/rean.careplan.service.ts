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
import { CAssessmentTemplate } from '../../../../domain.types/clinical/assessment/assessment.types';
import { AssessmentService } from "../../../../services/clinical/assessment/assessment.service";
import { UserTaskService } from '../../../../services/users/user/user.task.service';
import { AssessmentTemplateRepo } from '../../../../database/sql/sequelize/repositories/clinical/assessment/assessment.template.repo';
import { TimeHelper } from "../../../../common/time.helper";
import { DurationType } from "../../../../domain.types/miscellaneous/time.types";
import { ActionPlanDto } from "../../../../domain.types/users/patient/action.plan/action.plan.dto";
import { GoalDto } from "../../../../domain.types/users/patient/goal/goal.dto";
import { HealthPriorityDto } from "../../../../domain.types/users/patient/health.priority/health.priority.dto";
import { CareplanRepo } from "../../../../database/sql/sequelize/repositories/clinical/careplan/careplan.repo";
import { CareplanService } from "../../../../services/clinical/careplan.service";
import { Injector } from "../../../../startup/injector";
import { UserTaskCategory } from "../../../../domain.types/users/user.task/user.task.types";

//////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ReanCareplanService implements ICareplanService {

    _assessmentService: AssessmentService = null;

    _userTaskService: UserTaskService = null;

    _assessmentTemplateRepo: AssessmentTemplateRepo = null;

    _careplanRepo: CareplanRepo = null;

    _careplanService: CareplanService = null;

    constructor() {
        this._assessmentService = Injector.Container.resolve(AssessmentService);
        this._userTaskService = Injector.Container.resolve(UserTaskService);
        this._assessmentTemplateRepo = Injector.Container.resolve(AssessmentTemplateRepo);
        this._careplanRepo = Injector.Container.resolve(CareplanRepo);
        this._careplanService = Injector.Container.resolve(CareplanService);
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
            TenantId               : patientDetails.TenantId,
            UniqueReferenceId      : patientDetails.UniqueReferenceId
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
            DayOffset      : model.DayOffset,
            Language       : model.Language,
            IsTest         : model.IsTest,
            TenantId       : model.TenantId,
            ScheduleConfig : model.ScheduleConfig
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
                Provider               : null,
                ProviderActionId       : activity.id,
                Title                  : activity.Asset.Name,
                Type                   : activity.AssetType,
                Category               : this.mapAssetTypeToUserTaskCategory(activity.AssetType),
                Description            : activity.Asset.Description,
                Language               : 'English',
                ScheduledAt            : activity.ScheduledDate,
                TimeSlot               : activity.TimeSlot,
                IsRegistrationActivity : activity.IsRegistrationActivity,
                RawContent             : JSON.stringify(activity.Asset)
            };

            activityEntities.push(entity);

        });

        Logger.instance().log(`Number of activities retrived ${activityEntities.length}.`);

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

    public getActivity = async (
        patientUserId: string,
        careplanCode: string,
        enrollmentId: string | number,
        activityId: string,
        scheduledAt?: string
    ): Promise<CareplanActivity> => {

        const careplanApiBaseUrl = process.env.CAREPLAN_API_BASE_URL;
        const url = `${careplanApiBaseUrl}/enrollment-tasks/${activityId}`;

        const headerOptions = await this.getHeaderOptions();
        const response = await needle("get", url, headerOptions);

        if (response.statusCode !== 200) {
            Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
            throw new ApiError(500, 'Careplan service get activity service error: ' + (response.body.error?.message));
        }

        const activity = response.body.Data;
        if (!activity) {
            throw new ApiError(404, 'Activity not found');
        }
        const status = this.getActivityStatus(activity.Status);

        const entity: CareplanActivity = {
            ParticipantId          : activity.ParticipantId,
            EnrollmentId           : activity.EnrollmentId,
            Provider               : this.providerName(),
            ProviderActionId       : activity.id,
            Title                  : activity.Asset?.Name || activity.Title,
            Type                   : activity.AssetType,
            Category               : this.mapAssetTypeToUserTaskCategory(activity.AssetType),
            Description            : activity.Asset?.Description || activity.Description,
            Language               : activity.Language,
            ScheduledAt            : activity.ScheduledDate ? new Date(activity.ScheduledDate) : null,
            TimeSlot               : activity.TimeSlot,
            IsRegistrationActivity : activity.IsRegistrationActivity,
            Status                 : status,
            CompletedAt            : activity.CompletedDate,
            RawContent             : activity.Asset ? JSON.stringify(activity.Asset) : activity
        };

        Logger.instance().log(`Successfully retrieved activity ${activityId} from careplan service.`);

        return entity;
    };

    public completeActivity = async (
        patientUserId: string,
        careplanCode: string,
        enrollmentId: string | number,
        activityId: string,
        updates: any
    ): Promise<CareplanActivity> => {

        const careplanApiBaseUrl = process.env.CAREPLAN_API_BASE_URL;
        const url = `${careplanApiBaseUrl}/enrollment-tasks/${activityId}`;

        const updateData = {
            Status      : ProgressStatus.Completed,
            CompletedAt : new Date()
        };

        const headerOptions = await this.getHeaderOptions();
        const response = await needle("put", url, updateData, headerOptions);

        if (response.statusCode !== 200) {
            Logger.instance().log(`ResponseCode: ${response.statusCode}, Body: ${JSON.stringify(response.body.error)}`);
            throw new ApiError(500, 'Careplan service update enrollment task error: ' + (response.body.error?.message));
        }

        const updatedActivity = response.body.Data;
        if (!updatedActivity) {
            return await this.getActivity(patientUserId, careplanCode, enrollmentId, activityId);
        }
        const status = this.getActivityStatus(updatedActivity.Status);

        const entity: CareplanActivity = {
            ParticipantId          : updatedActivity.ParticipantId,
            EnrollmentId           : updatedActivity.EnrollmentId,
            Provider               : this.providerName(),
            ProviderActionId       : updatedActivity.id,
            Title                  : updatedActivity.Asset?.Name,
            Type                   : updatedActivity.AssetType,
            Category               : this.mapAssetTypeToUserTaskCategory(updatedActivity.AssetType),
            Description            : updatedActivity.Asset?.Description,
            Language               : 'English',
            ScheduledAt            : updatedActivity.ScheduledDate,
            TimeSlot               : updatedActivity.TimeSlot,
            IsRegistrationActivity : updatedActivity.IsRegistrationActivity,
            Status                 : status,
            CompletedAt            : updatedActivity.CompletedDate ? new Date(updatedActivity.CompletedDate) : null,
            RawContent             : updatedActivity.Asset ? JSON.stringify(updatedActivity.Asset) : updatedActivity
        };

        Logger.instance().log(`Successfully completed activity ${activityId} from careplan service.`);

        return entity;
    };

    public deleteParticipantData = async (participantId: string): Promise<boolean> => {
        try {
            var url = process.env.CAREPLAN_API_BASE_URL + `/participants/${participantId}`;
            var headerOptions = await this.getHeaderOptions();
            var response = await needle('delete', url, headerOptions);

            if (response.statusCode !== 200) {
                Logger.instance().log(`ResponseCode: ${response.statusCode}, Body: ${JSON.stringify(response.body.error)}`);
                throw new ApiError(500, 'Careplan participant deletion error: ' + response.body.error);
            }

            Logger.instance().log(`Successfully deleted participant ${participantId} from careplan service`);
            return true;
        } catch (error) {
            Logger.instance().log(`Error deleting participant from careplan service: ${error.message}`);
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

    private mapAssetTypeToUserTaskCategory(assetType: string): UserTaskCategory {
        const mapping: { [key: string]: UserTaskCategory } = {
            'Video'         : UserTaskCategory.EducationalVideo,
            'Audio'         : UserTaskCategory.EducationalAudio,
            'Animation'     : UserTaskCategory.EducationalAnimation,
            'Web link'      : UserTaskCategory.EducationalLink,
            'Infographics'  : UserTaskCategory.EducationalInfographics,
            'Web newsfeed'  : UserTaskCategory.EducationalNewsFeed,
            'Medication'    : UserTaskCategory.Medication,
            'Appointment'   : UserTaskCategory.Appointment,
            'Exercise'      : UserTaskCategory.Exercise,
            'Nutrition'     : UserTaskCategory.Nutrition,
            'Biometrics'    : UserTaskCategory.Biometrics,
            'Assessment'    : UserTaskCategory.Assessment,
            'Challenge'     : UserTaskCategory.Challenge,
            'Goal'          : UserTaskCategory.Goal,
            'Consultation'  : UserTaskCategory.Consultation,
            'Reflection'    : UserTaskCategory.PersonalReflection,
            'Message'       : UserTaskCategory.Message,
            'Meditation'    : UserTaskCategory.StressManagement,
            'Action plan'   : UserTaskCategory.Custom,
            'Article'       : UserTaskCategory.EducationalLink,
            'Checkup'       : UserTaskCategory.Custom,
            'Physiotherapy' : UserTaskCategory.Exercise,
            'Priority'      : UserTaskCategory.Custom,
            'Reminder'      : UserTaskCategory.Custom,
            'Word power'    : UserTaskCategory.Custom
        };

        return mapping[assetType] || UserTaskCategory.Custom;
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

    public processActivityDetails = async (
        activity: any,
        details: CareplanActivity,
        scheduledAt: string
    ): Promise<any> => {

        activity['RawContent'] = details.RawContent;

        return activity;
    };

    //#endregion

}

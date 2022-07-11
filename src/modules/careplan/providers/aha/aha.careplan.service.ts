import { ICareplanService } from "../../interfaces/careplan.service.interface";
import needle = require('needle');
import { Logger } from '../../../../common/logger';
import { AhaCache } from './aha.cache';
import { ApiError } from "../../../../common/api.error";
import { injectable } from "tsyringe";
import { EnrollmentDomainModel } from "../../../../domain.types/clinical/careplan/enrollment/enrollment.domain.model";
import { Helper } from "../../../../common/helper";
import { CareplanActivity } from "../../../../domain.types/clinical/careplan/activity/careplan.activity";
import { ParticipantDomainModel } from "../../../../domain.types/clinical/careplan/participant/participant.domain.model";
import { ProgressStatus } from "../../../../domain.types/miscellaneous/system.types";
import { UserActionType, UserTaskCategory } from "../../../../domain.types/user/user.task/user.task.types";
import {
    QueryResponseType,
    CAssessmentQueryResponse,
    CAssessmentTemplate,
} from '../../../../domain.types/clinical/assessment/assessment.types';
import { AhaAssessmentConverter } from "./aha.assessment.converter";
import { ActionPlanDto } from "../../../../domain.types/action.plan/action.plan.dto";
import { HealthPriorityType } from "../../../../domain.types/patient/health.priority.type/health.priority.types";
import { GoalDto } from "../../../../domain.types/patient/goal/goal.dto";
import { AssessmentDto } from "../../../../domain.types/clinical/assessment/assessment.dto";
import { BiometricsType } from "../../../../domain.types/clinical/biometrics/biometrics.types";
import { HealthPriorityDto } from "../../../../domain.types/patient/health.priority/health.priority.dto";
import { AssessmentService } from "../../../../services/clinical/assessment/assessment.service";
import { Loader } from '../../../../startup/loader';
import { UserTaskService } from '../../../../services/user/user.task.service';
import { AssessmentTemplateRepo } from '../../../../database/sql/sequelize/repositories/clinical/assessment/assessment.template.repo';
import { AssessmentDomainModel } from "../../../../domain.types/clinical/assessment/assessment.domain.model";
import { UserTaskDomainModel } from "../../../../domain.types/user/user.task/user.task.domain.model";
import { TimeHelper } from "../../../../common/time.helper";
import { DurationType } from "../../../../domain.types/miscellaneous/time.types";

//////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class AhaCareplanService implements ICareplanService {

    _assessmentService: AssessmentService = null;

    _userTaskService: UserTaskService = null;

    _assessmentTemplateRepo: AssessmentTemplateRepo = null;

    constructor() {
        this._assessmentService = Loader.container.resolve(AssessmentService);
        this._userTaskService = Loader.container.resolve(UserTaskService);
        this._assessmentTemplateRepo = Loader.container.resolve(AssessmentTemplateRepo);
    }

    private ActivityCode = '9999';

    public providerName(): string {
        return "AHA";
    }

    private getActivityCode(): string {
        return this.ActivityCode;
    }

    //#region Publics

    public init = async (): Promise<boolean> => {

        var headers = {
            'Content-Type'    : 'application/x-www-form-urlencoded',
            Accept            : '*/*',
            'Cache-Control'   : 'no-cache',
            'Accept-Encoding' : 'gzip, deflate, br',
            Connection        : 'keep-alive',
        };

        var options = {
            headers    : headers,
            compressed : true,
            json       : false,
        };

        var url = process.env.AHA_API_BASE_URL + '/token';

        var body = {
            client_id     : process.env.AHA_API_CLIENT_ID,
            client_secret : process.env.AHA_API_CLIENT_SECRET,
            grant_type    : 'client_credentials',
        };

        var response = await needle('post', url, body, options);
        if (response.statusCode === 200) {
            AhaCache.SetWebToken(response.body.access_token, response.body.expires_in);
            Logger.instance().log('Successfully connected to AHA API service!');
            return true;
        } else {
            Logger.instance().error('Unable to connect AHA API service!', response.statusCode, null);
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
            if (isBefore || planCode !== 'CholesterolMini') {
                resolve({
                    Eligible : true
                });
            }
            else {
                resolve({
                    Eligible : false,
                    Reason   : `Sorry, you are too young to register. Check out our resources at https://heart.org/cholesterol`
                });
            }
        });
    };

    public registerPatient = async (patientDetails: ParticipantDomainModel): Promise<string> => {

        const entity = {
            PatientUserId  : patientDetails.PatientUserId,
            Name           : patientDetails.Name,
            IsActive       : true,
            Gender         : patientDetails.Gender,
            Age            : patientDetails.Age,
            DOB            : null,
            HeightInInches : null,
            WeightInLbs    : null,
            MaritalStatus  : null,
            ZipCode        : null,
        };

        var meta = {};

        if (entity.Age) {
            meta['age'] = entity.Age;
        }
        if (entity.DOB) {
            meta['dob'] = entity.DOB;
        }
        if (entity.Gender) {
            meta['gender'] = entity.Gender;
        }
        if (entity.HeightInInches) {
            meta['heightInInches'] = entity.HeightInInches;
        }
        if (entity.MaritalStatus) {
            meta['maritalStatus'] = entity.MaritalStatus;
        }
        if (entity.WeightInLbs) {
            meta['weightInLbs'] = entity.WeightInLbs;
        }
        if (entity.ZipCode) {
            meta['zipCode'] = entity.ZipCode;
        }

        var body = {
            isActive : 1,
            meta     : meta,
            userId   : entity.PatientUserId,
        };

        if (entity.Name) {
            body['name'] = entity.Name;
        }

        var url = process.env.AHA_API_BASE_URL + '/participants';
        var headerOptions = await this.getHeaderOptions();
        var response = await needle('post', url, body, headerOptions);

        if (response.statusCode !== 200) {
            Logger.instance().log(`ResponseCode: ${response.statusCode}, Body: ${JSON.stringify(response.body.error)}`);
            throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
        }

        return response.body.data.participant.id;
    };

    public enrollPatientToCarePlan = async (model: EnrollmentDomainModel): Promise<string> => {

        var enrollmentData = {
            userId       : model.PatientUserId,
            careplanCode : model.PlanCode,
            startAt      : model.StartDate,
            endAt        : model.EndDate,
            meta         : {
                gender : model.Gender,
            },
        };

        var url = process.env.AHA_API_BASE_URL + '/enrollments';
        var headerOptions = await this.getHeaderOptions();
        var response = await needle('post', url, enrollmentData, headerOptions);

        if (response.statusCode !== 200) {
            Logger.instance().log(`ResponseCode: ${response.statusCode}, Body: ${JSON.stringify(response.body.error)}`);
            throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
        }

        if (model.PlanCode === 'CholesterolMini') {
            var assessmentTitles = ['Cholesterol Demographic', 'Nutrition', 'Cholesterol medical details'];
            var index = 0;
            for await (var assessmentTitle of assessmentTitles) {
                const actionId = await this.createInitialAssessmentTask(model, assessmentTitle, index);
                Logger.instance().log(`Action id for ${assessmentTitle} assessment is ${actionId}`);
                index++;
            }
        }

        Logger.instance().log(`response body: ${JSON.stringify(response.body)}`);

        return response.body.data.enrollment.id;
    };

    public fetchActivities = async (
        careplanCode: string,
        enrollmentId: string,
        fromDate: Date,
        toDate: Date): Promise<CareplanActivity[]> => {
        
        var startDate = Helper.formatDate(fromDate);
        var endDate = Helper.formatDate(toDate);
    
        Logger.instance().log(`Start Date: ${(startDate)}`);
        Logger.instance().log(`End Date: ${(endDate)}`);
    
        const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;
        const url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/activities?fromDate=${startDate}&toDate=${endDate}&pageSize=500`;
        const headerOptions = await this.getHeaderOptions();
        var response = await needle("get", url, headerOptions);
    
        if (response.statusCode !== 200) {
            Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
            Logger.instance().error('Unable to fetch tasks for given enrollment id!', response.statusCode, null);
            throw new ApiError(500, "Careplan service error: " + response.body.error.message);
        }
        
        Logger.instance().log(`response body for activities: ${JSON.stringify(response.body.data.activities.length)}`);

        var activities = response.body.data.activities;
        var activityEntities: CareplanActivity[] = [];

        activities.forEach(activity => {

            const tmp = activity.title ? activity.title : '';
            const title = activity.name ? activity.name : tmp;
            const category: UserTaskCategory = this.getUserTaskCategory(
                activity.type, activity.title, activity.contentTypeCode);
            const status = this.getActivityStatus(activity.status);
            const description = this.getActivityDescription(activity.text, activity.description);

            var entity: CareplanActivity = {
                EnrollmentId     : enrollmentId,
                Provider         : this.providerName(),
                Type             : activity.type,
                Category         : category,
                ProviderActionId : activity.code,
                Title            : title,
                Description      : description,
                Url              : activity.url ?? null,
                Language         : 'English',
                ScheduledAt      : activity.scheduledAt,
                Sequence         : activity.sequence,
                Frequency        : activity.frequency,
                Status           : status,
            };
            activityEntities.push(entity);
        });

        return activityEntities;
    };

    public getActivity = async(
        patientUserId: string,
        careplanCode: string,
        enrollmentId: string,
        providerActionId: string,
        scheduledAt?:string): Promise<CareplanActivity> => {

        const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;
        var url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/activities/${providerActionId}`;
        if (scheduledAt) {
            url += `?scheduledAt=${scheduledAt}`;
        }
    
        var headerOptions = await this.getHeaderOptions();
        var response = await needle("get", url, headerOptions);
    
        if (response.statusCode !== 200) {
            Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
            throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
        }
    
        var activity = response.body.data.activity;
        const tmp = activity.title ? activity.title : '';
        const title = activity.name ? activity.name : tmp;

        const category: UserTaskCategory = this.getUserTaskCategory(
            activity.type, title, activity.contentTypeCode);

        const status = this.getActivityStatus(activity.status);
        const description = this.getActivityDescription(activity.text, activity.description);

        var activityUrl = this.extractUrl(activity.url, category, activity);
            
        var entity: CareplanActivity = {
            ProviderActionId : activity.code,
            EnrollmentId     : enrollmentId,
            Provider         : 'AHA',
            Type             : activity.type ?? activity.contentTypeCode,
            Category         : category,
            Title            : title,
            Description      : description,
            Url              : activityUrl,
            Language         : 'English',
            Status           : status,
            // Comments        : ,
            RawContent       : activity,
        };
    
        if (category === UserTaskCategory.EducationalNewsFeed) {
            var newsItems = await this.extractNewsItems(activityUrl);
            entity['RawContent'] = newsItems;
        }
        
        return entity;
    };

    public patchActivity = async (
        enrollmentId: string,
        providerActivityId: string) => {

        var updates = {
            completedAt : Helper.formatDate(new Date()),
            status      : 'COMPLETED',
        };

        const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;

        var url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/activities/${providerActivityId}`;

        var headerOptions = await this.getHeaderOptions();
        var response = await needle("patch", url, updates, headerOptions);

        if (response.statusCode !== 200) {
            Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
            throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
        }

        var activity = response.body.data.activity;

        var entity: CareplanActivity = {
            Provider         : this.providerName(),
            Type             : activity.type,
            ProviderActionId : activity.code,
            Title            : activity.title,
            ScheduledAt      : activity.scheduledAt,
            Sequence         : activity.sequence,
            Frequency        : activity.frequency,
            Status           : activity.status,
            CompletedAt      : activity.completedAt,
            Comments         : activity.comments,
        };

        return entity;
    };

    public completeActivity = async(
        patientUserId: string,
        careplanCode: string,
        enrollmentId: string,
        providerActivityId: string,
        activityUpdates: any): Promise<CareplanActivity> => {

        Logger.instance().log(`Updating activity for patient user id '${patientUserId} associated with carte plan '${careplanCode}'.`);

        const taskCategory = activityUpdates.Category as UserTaskCategory;
        if (taskCategory === UserTaskCategory.Assessment) {
            return await this.patchAssessment(enrollmentId, providerActivityId, activityUpdates);
        }
        else {
            return await this.patchActivity(enrollmentId, providerActivityId);
        }
    };

    //#region Assessment related

    public patchAssessment = async (
        enrollmentId: string,
        providerActivityId: string,
        activityUpdates: any) => {

        const updates = await this.getAssessmentUpdateModel(activityUpdates);

        const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;
        const scheduledAt = activityUpdates.ScheduledAt.toISOString().split('T')[0];
        const sequence = activityUpdates.Sequence;

        var url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/assessments/${providerActivityId}?scheduledAt=${scheduledAt}&sequence=${sequence}`;

        var headerOptions = await this.getHeaderOptions();
        var response = await needle("patch", url, updates, headerOptions);

        if (response.statusCode !== 200) {
            Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
            throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
        }

        var assessment = response.body.data.assessment;

        var entity: CareplanActivity = {
            Provider         : this.providerName(),
            Type             : assessment.type,
            ProviderActionId : assessment.code,
            Title            : assessment.title,
            ScheduledAt      : activityUpdates.ScheduledAt,
            Sequence         : activityUpdates.Sequence,
            Status           : 'Completed',
            CompletedAt      : activityUpdates.CompletedAt,
        };

        return entity;
    };

    public convertToAssessmentTemplate = async (activity: CareplanActivity): Promise<CAssessmentTemplate> => {
        const ahaServiceHelper = new AhaAssessmentConverter();
        return await ahaServiceHelper.convertToAssessmentTemplate(activity);
    };

    //#endregion

    //#region Goals, priorities and action plans

    public getGoals = async (patientUserId: string, enrollmentId: string, category: string): Promise<GoalDto[]> => {
        try {
        
            var categoryCode = null;

            var activityCode = this.getActivityCode();
            for (const key in HealthPriorityType) {
                if (HealthPriorityType[key] === category) {
                    categoryCode = key;
                }
            }

            const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;
            const url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/goals/${activityCode}?categories=${categoryCode}&pageSize=500`;
            var headerOptions = await this.getHeaderOptions();
            var response = await needle("get", url, headerOptions);
    
            if (response.statusCode !== 200) {
                Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
                Logger.instance().error('Unable to fetch goals for given enrollment id!', response.statusCode, null);
                throw new ApiError(500, "Careplan service error: " + response.body.error.message);
            }
    
            Logger.instance().log(`response body for goals: ${JSON.stringify(response.body.data.goals.length)}`);
            var goals = response.body.data.goals;
            var goalEntities: GoalDto[] = [];
            goals.forEach(goal => {
                var entity: GoalDto = {
                    Provider         : this.providerName(),
                    Title            : goal.name,
                    ProviderGoalCode : goal.code,
                    Sequence         : goal.sequence,

                };
                goalEntities.push(entity);
            });

            return goalEntities;
    
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public getActionPlans = async (
        patientUserId: string,
        enrollmentId: string,
        category: string
    ): Promise<ActionPlanDto[]> => {
        try {
        
            var activityCode = this.getActivityCode();

            Logger.instance().log(`Category :: ${JSON.stringify(category)}`);
            var categoryCode = null;
            
            for (const key in HealthPriorityType) {
                if (HealthPriorityType[key] === category) {
                    categoryCode = key;
                }
            }

            Logger.instance().log(`Category code:: ${JSON.stringify(categoryCode)}`);

            const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;
            const url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/actionPlans/${activityCode}?categories=${categoryCode}&pageSize=500`;
            var headerOptions = await this.getHeaderOptions();
            var response = await needle("get", url, headerOptions);
    
            if (response.statusCode !== 200) {
                Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
                Logger.instance().error('Unable to fetch action plans for given enrollment id!', response.statusCode, null);
                throw new ApiError(500, "Careplan service error: " + response.body.error.message);
            }
    
            Logger.instance().log(`response body for action plans: ${JSON.stringify(response.body.data.actionPlans.length)}`);
            var actionPlans = response.body.data.actionPlans;
            var actionPlanEntities: ActionPlanDto[] = [];
            actionPlans.forEach(actionPlan => {
                var entity: ActionPlanDto = {
                    Provider : this.providerName(),
                    Title    : actionPlan.name,

                };
                actionPlanEntities.push(entity);
            });

            return actionPlanEntities;
    
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    public updateActionPlan = async (
        enrollmentId: string,
        actionName: string ) => {

        var updates = {
            actionPlans : [actionName],
            completedAt : Helper.formatDate(new Date()),
            status      : 'COMPLETED',
        };

        var activityCode = this.getActivityCode();

        const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;

        var url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/actionPlans/${activityCode}`;

        var headerOptions = await this.getHeaderOptions();
        var response = await needle("patch", url, updates, headerOptions);

        if (response.statusCode !== 200) {
            Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
            throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
        }

        var activity = response.body.data.activity;

        var entity: ActionPlanDto = {
            Provider    : this.providerName(),
            Status      : activity.status,
            CompletedAt : activity.completedAt,
            Title       : activity.actionPlans
        };

        Logger.instance().log(`Updated action plan record from AHA:: ${JSON.stringify(entity)}`);

        return entity;
    };

    public updateGoal = async (
        enrollmentId: string,
        goalName: string ) => {

        var updates = {
            goals       : [goalName],
            completedAt : Helper.formatDate(new Date()),
            status      : 'COMPLETED',
        };

        var activityCode = this.getActivityCode();

        const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;

        var url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/goals/${activityCode}`;

        var headerOptions = await this.getHeaderOptions();
        var response = await needle("patch", url, updates, headerOptions);

        if (response.statusCode !== 200) {
            Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
            throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
        }

        var activity = response.body.data.activity;

        var entity: GoalDto = {
            Provider     : this.providerName(),
            GoalAchieved : activity.status,
            CompletedAt  : activity.completedAt,
            Title        : activity.goals
        };

        Logger.instance().log(`Updated goal record from AHA:: ${JSON.stringify(entity)}`);

        return entity;
    };

    public updateHealthPriority = async (
        patientUserId: string,
        enrollmentId: string,
        healthPriorityType: string ) => {

        var updates = {
            priorities  : [healthPriorityType],
            completedAt : Helper.formatDate(new Date()),
            status      : 'COMPLETED',
        };

        var activityCode = this.getActivityCode();

        const AHA_API_BASE_URL = process.env.AHA_API_BASE_URL;

        var url = `${AHA_API_BASE_URL}/enrollments/${enrollmentId}/priorities/${activityCode}`;

        var headerOptions = await this.getHeaderOptions();
        var response = await needle("patch", url, updates, headerOptions);

        if (response.statusCode !== 200) {
            Logger.instance().log(`Body: ${JSON.stringify(response.body.error)}`);
            throw new ApiError(500, 'Careplan service error: ' + response.body.error.message);
        }

        var activity = response.body.data.activity;

        var entity: HealthPriorityDto = {
            Provider             : this.providerName(),
            PatientUserId        : patientUserId,
            ProviderEnrollmentId : enrollmentId,
            Status               : activity.status,
            CompletedAt          : activity.completedAt,
            HealthPriorityType   : activity.priorities
        };

        Logger.instance().log(`Updated health priority record from AHA :: ${JSON.stringify(entity)}`);

        return entity;
    };
    //#endregion

    //#endregion

    //#region Privates

    private extractUrl(url: string, category: UserTaskCategory, activity: any) {
        var activityUrl = url ?? null;
        if (activityUrl && Helper.isUrl(activityUrl)) {
            return activityUrl;
        }
        if (category === UserTaskCategory.EducationalNewsFeed) {
            var locale = activity.locale;
            if (locale && locale.length > 0)  {
                var obj = locale[0];
                if (obj) {
                    var x = obj['en-US'];
                    if (x) {
                        var xUrl = x['url'];
                        if (Helper.isUrl(xUrl)) {
                            activityUrl = xUrl;
                        }
                    }
                }
            }
        }
        return activityUrl;
    }

    private async getAssessmentUpdateModel(activity: any): Promise<any> {

        var updates = {
            completedAt : Helper.formatDate(new Date()),
            status      : 'COMPLETED',
        };
        
        const taskCategory = activity.Category;

        if (taskCategory !== UserTaskCategory.Assessment) {
            return updates;
        }

        const assessment = activity['ActionDetails'] as AssessmentDto;
        if (!assessment) {
            return null;
        }

        const userResponses = assessment.UserResponses as CAssessmentQueryResponse[];
        updates['items'] = [];

        for (var res of userResponses) {

            var responseType = res.ResponseType;
            var node = res.Node;
            var v = {
                id     : node.ProviderGivenId,
                values : []
            };

            switch (responseType) {
                case QueryResponseType.SingleChoiceSelection: {
                    var option = JSON.parse(res.Additional);
                    v.values.push({
                        value : option.Text
                    });
                    updates['items'].push(v);
                    break;
                }
                case QueryResponseType.MultiChoiceSelection: {
                    var options = JSON.parse(res.Additional);
                    for (var opt of options) {
                        v.values.push({
                            value : opt.Text
                        });
                    }
                    updates['items'].push(v);
                    break;
                }
                case QueryResponseType.Text: {
                    v.values.push({
                        value : res.TextValue
                    });
                    updates['items'].push(v);
                    break;
                }
                case QueryResponseType.Integer: {
                    v.values.push({
                        value : res.IntegerValue.toString()
                    });
                    updates['items'].push(v);
                    break;
                }
                case QueryResponseType.Float: {
                    v.values.push({
                        value : res.FloatValue.toString()
                    });
                    updates['items'].push(v);
                    break;
                }
                case QueryResponseType.Boolean: {
                    v.values.push({
                        value : res.BooleanValue.toString()
                    });
                    updates['items'].push(v);
                    break;
                }
                case QueryResponseType.Ok: {
                    v.values.push({
                        value : 'Ok'
                    });
                    updates['items'].push(v);
                    break;
                }
                case QueryResponseType.Biometrics: {
                    var biometrics = JSON.parse(res.TextValue);
                    for (var b of biometrics) {
                        var biometricsType = b.BiometricsType as BiometricsType;
                        this.populateBiometricValues(biometricsType, v, b);
                    }
                    updates['items'].push(v);
                    break;
                }
            }
        }

        return updates;
    }

    private populateBiometricValues(biometricsType: BiometricsType, v: { id: string; values: any[]; }, b: any) {

        switch (biometricsType) {
            case BiometricsType.BloodGlucose: {
                v.values.push({
                    value : b.BloodGlucose
                });
                break;
            }
            case BiometricsType.BloodOxygenSaturation: {
                v.values.push({
                    value : b.BloodOxygenSaturation
                });
                break;
            }
            case BiometricsType.BloodPressure: {
                v.values.push({
                    value : b.Systolic
                });
                v.values.push({
                    value : b.Diastolic
                });
                break;
            }
            case BiometricsType.BodyWeight: {
                v.values.push({
                    value : b.BodyWeight
                });
                break;
            }
            case BiometricsType.BodyTemperature: {
                v.values.push({
                    value : b.BodyTemperature
                });
                break;
            }
            case BiometricsType.BodyHeight: {
                v.values.push({
                    value : b.BodyHeight
                });
                break;
            }
            case BiometricsType.Pulse: {
                v.values.push({
                    value : b.Pulse
                });
                break;
            }
            default: {
                // Don't send anything else
            }
        }

    }

    private async getHeaderOptions() {
        const currentTime = new Date();

        if (currentTime > AhaCache.GetTokenExpirationTime()) {
            Logger.instance().log('AHA token expired, generating new token.');
            await this.init();
        }

        const token = AhaCache.GetWebToken();
        var headers = {
            'Content-Type' : 'application/json',
            accept         : 'application/json',
            Authorization  : `Bearer ${token}`,
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

    private getUserTaskCategory(activityType: string, title?: string, contentTypeCode?: string): UserTaskCategory {
        
        if (activityType === 'Questionnaire' || activityType === 'Assessment') {
            return UserTaskCategory.Assessment;
        }
        var type = activityType ?? contentTypeCode;

        if (type === 'Video')
        {
            return UserTaskCategory.EducationalVideo;
        }
        if (type === 'Audio')
        {
            return UserTaskCategory.EducationalAudio;
        }
        if (type === 'Animation')
        {
            return UserTaskCategory.EducationalAnimation;
        }
        if (type === 'Link')
        {
            return UserTaskCategory.EducationalLink;
        }
        if (type === 'Infographic')
        {
            return UserTaskCategory.EducationalInfographics;
        }
        if (type === 'Web') {
            return UserTaskCategory.EducationalNewsFeed;
        }
        if (type === 'Message') {
            return UserTaskCategory.Message;
        }
        if (type === 'Goal') {
            return UserTaskCategory.Goal;
        }
        if (type === 'Challenge') {
            return UserTaskCategory.Challenge;
        }
        if ((type === 'Professional' && title === 'Weekely review') ||
            (type === 'Professional' && title === 'Week televisit')) {
            return UserTaskCategory.Consultation;
        }
        return UserTaskCategory.Custom;
    }

    private getActivityDescription(text: string, description: string) {
        var desc = '';
        if (text && text.length > 0) {
            desc = text;
            desc += '\n';
        }
        if (description && description.length > 0) {
            desc = description;
            desc += '\n';
        }
        return desc;
    }

    private createInitialAssessmentTask = async (
        model: EnrollmentDomainModel,
        templateName: string,
        index: number): Promise<any> => {

        const searchResult = await this._assessmentTemplateRepo.search({ Title: templateName });
        if (searchResult.Items.length === 0) {
            return null;
        }
        const template = searchResult.Items[0];
        const templateId: string = template.id;

        const assessmentBody : AssessmentDomainModel = {
            PatientUserId        : model.PatientUserId,
            Title                : template.Title,
            Type                 : template.Type,
            AssessmentTemplateId : templateId,
            ScheduledDateString  : model.StartDate.toISOString().split('T')[0]
        };

        const assessment = await this._assessmentService.create(assessmentBody);
        const assessmentId = assessment.id;

        const userTaskBody : UserTaskDomainModel = {
            UserId             : model.PatientUserId,
            Task               : templateName,
            Category           : UserTaskCategory.Assessment,
            ActionType         : UserActionType.Careplan,
            ActionId           : assessmentId,
            ScheduledStartTime : (TimeHelper.addDuration(model.StartDate, index, DurationType.Minute)),
            IsRecurrent        : false
        };

        const userTask = await this._userTaskService.create(userTaskBody);

        return userTask.ActionId;
    }

    private extractNewsItems = async (url: string) => {
        try {
            var response = await needle("get", url, {});
            var children = response.body.children[0].children;
            var list = children.filter(x => x.name === 'item');
            var items = list.map(x => {
                const itemChildren = x.children;
                var link = itemChildren.find(y => y.name === 'link')?.value;
                var title = itemChildren.find(y => y.name === 'title')?.value;
                return {
                    Title : title,
                    Link  : link
                };
            });
            return {
                Newsfeed : items
            };
        }
        catch (error) {
            throw new ApiError(500, 'Unable to extract news items from the RSS feed!');
        }
    }

    //#endregion

}

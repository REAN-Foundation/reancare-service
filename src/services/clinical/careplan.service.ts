import { inject, injectable } from "tsyringe";
import { ICareplanRepo } from "../../database/repository.interfaces/clinical/careplan.repo.interface";
import { IPatientRepo } from "../../database/repository.interfaces/patient/patient.repo.interface";
import { IPersonRepo } from "../../database/repository.interfaces/person.repo.interface";
import { IUserRepo } from "../../database/repository.interfaces/user/user.repo.interface";
import { IAssessmentRepo } from "../../database/repository.interfaces/clinical/assessment/assessment.repo.interface";
import { IAssessmentTemplateRepo } from "../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface";
import { IAssessmentHelperRepo } from "../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface";
import { IUserTaskRepo } from "../../database/repository.interfaces/user/user.task.repo.interface";
import { EnrollmentDomainModel } from '../../domain.types/clinical/careplan/enrollment/enrollment.domain.model';
import { EnrollmentDto } from '../../domain.types/clinical/careplan/enrollment/enrollment.dto';
import { ApiError } from "../../common/api.error";
import { CareplanHandler } from '../../modules/careplan/careplan.handler';
import { ProgressStatus, uuid } from "../../domain.types/miscellaneous/system.types";
import { ParticipantDomainModel } from "../../domain.types/clinical/careplan/participant/participant.domain.model";
import { CareplanActivityDomainModel } from "../../domain.types/clinical/careplan/activity/careplan.activity.domain.model";
import { UserTaskCategory } from "../../domain.types/user/user.task/user.task.types";
import { UserActionType } from "../../domain.types/user/user.task/user.task.types";
import { TimeHelper } from "../../common/time.helper";
import { DurationType } from "../../domain.types/miscellaneous/time.types";
import { Logger } from "../../common/logger";
import { IUserActionService } from "../user/user.action.service.interface";
import { AssessmentTemplateDto } from "../../domain.types/clinical/assessment/assessment.template.dto";
import { CAssessmentTemplate } from "../../domain.types/clinical/assessment/assessment.types";
import { CareplanActivity } from "../../domain.types/clinical/careplan/activity/careplan.activity";
import { CareplanConfig } from "../../config/configuration.types";
import { AssessmentDomainModel } from "../../domain.types/clinical/assessment/assessment.domain.model";
import { CareplanActivityDto } from "../../domain.types/clinical/careplan/activity/careplan.activity.dto";
import { AssessmentDto } from "../../domain.types/clinical/assessment/assessment.dto";
import { AssessmentTemplateFileConverter } from "./assessment/assessment.template.file.converter";
import { UserTaskDomainModel } from "../../domain.types/user/user.task/user.task.domain.model";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class CareplanService implements IUserActionService {

    _handler: CareplanHandler = new CareplanHandler();

    constructor(
        @inject('ICareplanRepo') private _careplanRepo: ICareplanRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
        @inject('IAssessmentTemplateRepo') private _assessmentTemplateRepo: IAssessmentTemplateRepo,
        @inject('IAssessmentHelperRepo') private _assessmentHelperRepo: IAssessmentHelperRepo,
    ) {}

    public getAvailableCarePlans = (provider?: string): CareplanConfig[] => {
        return this._handler.getAvailableCarePlans(provider);
    };

    public enroll = async (enrollmentDetails: EnrollmentDomainModel): Promise<EnrollmentDto> => {

        var patient = await this.getPatient(enrollmentDetails.PatientUserId);
        if (!patient) {
            throw new Error('Patient does not exist!');
        }

        var participantId = null;
        const provider = enrollmentDetails.Provider;
        const planCode = enrollmentDetails.PlanCode;

        const planDetails = this._handler.getPlanDetails(provider, planCode);
        if (!planDetails) {
            throw new Error(`Specified care plan '${provider}-${planCode}' is not available.`);
        }
        const planName = planDetails.DisplayName;
        enrollmentDetails.PlanName = planName;

        //Check if the participant is already registered with the care plan provider
        var participant = await this._careplanRepo.getPatientRegistrationDetails(
            patient.UserId, provider);

        if (!participant) {

            if (!patient.User.Person.Gender || !patient.User.Person.BirthDate) {
                throw new Error('Gender and date of birth need to be specified before enrollment to care plan.');
            }

            //Since not registered with provider, register
            var participantDetails: ParticipantDomainModel = {
                Name           : patient.User.Person.DisplayName,
                PatientUserId  : enrollmentDetails.PatientUserId,
                Provider       : provider,
                Gender         : patient.User.Person.Gender,
                Age            : null, //Helper.getAgeFromBirthDate(patient.User.Person.BirthDate),
                Dob            : patient.User.Person.BirthDate,
                HeightInInches : null,
                WeightInLbs    : null,
                MaritalStatus  : null,
                ZipCode        : null,
            };

            participantId = await this._handler.registerPatientWithProvider(
                participantDetails, enrollmentDetails.Provider);

            participant = await this._careplanRepo.addPatientWithProvider(
                enrollmentDetails.PatientUserId, provider, participantId);

            if (!participant) {
                throw new Error('Error while adding care plan participant details to database.');
            }
        }

        enrollmentDetails.ParticipantId = participant.ParticipantId;
        enrollmentDetails.Gender = patient.User.Person.Gender;

        var enrollmentId = await this._handler.enrollPatientToCarePlan(enrollmentDetails);
        if (!enrollmentId) {
            throw new ApiError(500, 'Error while enrolling patient to careplan');
        }
        enrollmentDetails.EnrollmentId = enrollmentId;
        
        var dto = await this._careplanRepo.enrollPatient(enrollmentDetails);

        var activities = await this._handler.fetchActivities(
            enrollmentDetails.PatientUserId, enrollmentDetails.Provider, enrollmentDetails.PlanCode, enrollmentId,
            enrollmentDetails.StartDate, enrollmentDetails.EndDate);

        Logger.instance().log(`Activities: ${JSON.stringify(activities)}`);

        const activityModels = activities.map(x => {

            var a: CareplanActivityDomainModel = {
                PatientUserId    : enrollmentDetails.PatientUserId,
                EnrollmentId     : enrollmentId,
                ParticipantId    : enrollmentDetails.ParticipantId,
                Provider         : enrollmentDetails.Provider,
                PlanName         : enrollmentDetails.PlanName,
                PlanCode         : enrollmentDetails.PlanCode,
                Type             : x.Type,
                Category         : x.Category,
                ProviderActionId : x.ProviderActionId,
                Title            : x.Title,
                Description      : x.Description,
                Url              : x.Url,
                Language         : x.Language,
                ScheduledAt      : x.ScheduledAt,
                Sequence         : x.Sequence,
                Frequency        : x.Frequency,
                Status           : x.Status
            };
            return a;
        });

        var careplanActivities = await this._careplanRepo.addActivities(
            enrollmentDetails.Provider,
            enrollmentDetails.PlanName,
            enrollmentDetails.PlanCode,
            enrollmentDetails.PatientUserId,
            enrollmentId,
            activityModels);

        Logger.instance().log(`Careplan Activities: ${JSON.stringify(careplanActivities)}`);

        //task scheduling

        await this.createScheduledUserTasks(enrollmentDetails.PatientUserId, careplanActivities);

        return dto;
    };

    getPatientEnrollments = async (patientUserId: string) => {
        return await this._careplanRepo.getPatientEnrollments(patientUserId);
    };
    
    fetchTasks = async (careplanId: uuid): Promise<boolean> => {

        var enrollment = await this._careplanRepo.getCareplanEnrollment(careplanId);

        const enrollmentId = enrollment.EnrollmentId.toString();

        var activities = await this._handler.fetchActivities(
            enrollment.PatientUserId, enrollment.Provider, enrollment.PlanCode, enrollmentId,
            enrollment.StartAt, enrollment.EndAt);

        Logger.instance().log(`Activities: ${JSON.stringify(activities)}`);

        var careplanActivities: CareplanActivityDto[] = [];

        for await (var x of activities) {

            var existing: boolean = await this._careplanRepo.activityExists(
                x.Provider, x.EnrollmentId, x.ProviderActionId, x.Sequence, x.ScheduledAt);
            
            if (existing) {
                continue;
            }

            var activityModel: CareplanActivityDomainModel = {
                PatientUserId    : enrollment.PatientUserId,
                EnrollmentId     : enrollmentId,
                ParticipantId    : enrollment.ParticipantId.toString(),
                Provider         : enrollment.Provider,
                PlanName         : enrollment.PlanName,
                PlanCode         : enrollment.PlanCode,
                Type             : x.Type,
                Category         : x.Category,
                ProviderActionId : x.ProviderActionId,
                Title            : x.Title,
                Description      : x.Description,
                Url              : x.Url,
                Language         : x.Language,
                ScheduledAt      : x.ScheduledAt,
                Sequence         : x.Sequence,
                Frequency        : x.Frequency,
                Status           : x.Status
            };

            var careplanActivity = await this._careplanRepo.addActivity(
                enrollment.Provider,
                enrollment.PlanName,
                enrollment.PlanCode,
                enrollment.PatientUserId,
                enrollmentId,
                activityModel);
    
            careplanActivities.push(careplanActivity);

        }

        await this.createScheduledUserTasks(enrollment.PatientUserId, careplanActivities);
    
        return true;
    };

    public getActivity = async (activityId: uuid): Promise<CareplanActivityDto> => {
        return await this._careplanRepo.getActivity(activityId);
    };

    public getAction = async (activityId: uuid): Promise<any> => {

        var activity = await this._careplanRepo.getActivity(activityId);

        var scheduledAt = activity.ScheduledAt ? activity.ScheduledAt.toISOString().split('T')[0] : null;

        const details: CareplanActivity = await this._handler.getActivity(
            activity.PatientUserId,
            activity.Provider,
            activity.PlanCode,
            activity.EnrollmentId,
            activity.ProviderActionId,
            scheduledAt);
        
        details.PatientUserId = activity.PatientUserId;
        details.Provider = activity.Provider;
        details.PlanCode = activity.PlanCode;
        details.EnrollmentId = activity.EnrollmentId;
        details.ProviderActionId = activity.ProviderActionId;

        activity = await this._careplanRepo.updateActivityDetails(activity.id, details);
        details.Title = activity.Title;
        details.Description = activity.Description;

        //Handle assessment activities in special manner...
        if (activity.Category === UserTaskCategory.Assessment ||
            activity.Type === 'Assessment') {
            var template = await this.getAssessmentTemplate(details);
            const assessment = await this.getAssessment(activity, template, scheduledAt);
            activity['Assessment'] = assessment;
        }
        else {
            activity['RawContent'] = details.RawContent;
        }
        return activity;
    };

    public updateAction = async (activityId: uuid, updates: any): Promise<any> => {
        
        var activity = await this._careplanRepo.updateActivity(activityId, ProgressStatus.Completed, new Date());

        var activityUpdates = {
            CompletedAt : updates.CompletedAt,
            Status      : updates.Status,
        };

        var details = await this._handler.updateActivity(
            activity.PatientUserId,
            activity.Provider,
            activity.PlanCode,
            activity.EnrollmentId,
            activity.ProviderActionId, activityUpdates);
        
        Logger.instance().log(JSON.stringify(details, null, 2));
    
        activity['Details'] = details;

        return activity;
    };

    public startAction = async (activityId: uuid): Promise<boolean> => {
        await this._careplanRepo.getActivity(activityId);
        var activity = await this._careplanRepo.startActivity(activityId);
        Logger.instance().log(`Successfully started activity - ${activity.id}`);
        return true;
    };

    public completeAction = async (activityId: uuid, time: Date, success: boolean, actionDetails?: any) => {

        await this._careplanRepo.getActivity(activityId);
        var activity = await this._careplanRepo.completeActivity(activityId);
        const taskCategory = activity.Category;

        if (taskCategory === UserTaskCategory.Assessment) {
            //Collect assessment related details and send to handler
            activity['ActionDetails'] = actionDetails as AssessmentDto;
        }

        var updatedActivity = await this._handler.updateActivity(
            activity.PatientUserId, activity.Provider, activity.PlanCode,
            activity.EnrollmentId, activity.ProviderActionId, activity);

        Logger.instance().log(`CompletedActivity: ${JSON.stringify(updatedActivity, null, 2)}`);
        return updatedActivity.CompletedAt ? true : false;
    };

    public cancelAction = async (
        actionId: uuid,
        cancellationTime?: Date,
        cancellationReason?: string): Promise<boolean> => {

        // @TODO - We are not yet supporting cancellation of careplan activity

        Logger.instance().log(`Action id: ${actionId}`);
        Logger.instance().log(`Cancelled at: ${cancellationTime.toISOString()}`);
        Logger.instance().log(`Cancellation reason: ${cancellationReason}`);

        return true;
    };

    public getAssessmentTemplate = async (model: CareplanActivity): Promise<AssessmentTemplateDto> => {
 
        if (!model) {
            throw new Error('Invalid careplan activity encountered!');
        }

        if (model.Category !== UserTaskCategory.Assessment) {
            throw new Error('The given careplan activity is not an assessment activity!');
        }

        var existingTemplate = await this._assessmentTemplateRepo.getByProviderAssessmentCode(
            model.Provider, model.ProviderActionId);

        if (existingTemplate) {
            return existingTemplate;
        }
        
        var assessmentTemplate: CAssessmentTemplate =
            await this._handler.convertToAssessmentTemplate(model);

        // const fileResourceDto = await AssessmentTemplateFileConverter.storeAssessmentTemplate(assessmentTemplate);
        // assessmentTemplate.FileResourceId = fileResourceDto.id;

        const template = await this._assessmentHelperRepo.addTemplate(assessmentTemplate);
        return template;
    };

    private getAssessment = async (
        activity: CareplanActivityDto,
        template: AssessmentTemplateDto,
        scheduledAt: string): Promise<AssessmentDto> => {

        var existingAssessment = await this._assessmentRepo.getByActivityId(activity.id);
    
        if (existingAssessment) {
            return existingAssessment;
        }

        var code = template.DisplayCode ? template.DisplayCode.split('#')[1] : '';
        const displayCode = 'Assessment#' + code + ':' +
            (activity.EnrollmentId ? activity.EnrollmentId : 'x') + ':' + scheduledAt;

        const assessmentModel: AssessmentDomainModel = {
            PatientUserId          : activity.PatientUserId,
            DisplayCode            : displayCode,
            Title                  : template.Title,
            Description            : template.Description,
            AssessmentTemplateId   : template.id,
            Type                   : template.Type,
            Provider               : template.Provider,
            ProviderEnrollmentId   : activity.EnrollmentId,
            ProviderAssessmentCode : template.ProviderAssessmentCode,
            Status                 : ProgressStatus.Pending,
            ParentActivityId       : activity.id,
            UserTaskId             : activity.UserTaskId,
            ScheduledDateString    : scheduledAt,
            CurrentNodeId          : template.RootNodeId,
        };

        const assessment = await this._assessmentRepo.create(assessmentModel);
        return assessment;
    };

    //#region Privates

    private async getPatient(patientUserId: uuid) {

        var patientDto = await this._patientRepo.getByUserId(patientUserId);

        var user = await this._userRepo.getById(patientDto.UserId);
        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        patientDto.User = user;
        return patientDto;
    }

    private async createScheduledUserTasks(patientUserId, careplanActivities) {

        // create user tasks based on activities

        var userDto = await this._userRepo.getById(patientUserId);
        var timezoneOffset = '+05:30';
        if (userDto.DefaultTimeZone !== null) {
            timezoneOffset = userDto.DefaultTimeZone;
        }

        var activitiesGroupedByDate = {};
        for (const activity of careplanActivities) {

            var scheduledDate = TimeHelper.timestamp(activity.ScheduledAt);
            if (!activitiesGroupedByDate[scheduledDate]) {
                activitiesGroupedByDate[scheduledDate] = [];
            }

            activitiesGroupedByDate[scheduledDate].push(activity);
        }

        for (const scheduledDateKey in activitiesGroupedByDate) {

            var activities = activitiesGroupedByDate[scheduledDateKey];

            Logger.instance().log(`Creating user tasks for: ${scheduledDateKey}, total tasks: ${activities.length}`);

            activities.sort((a, b) => {
                return a.Sequence - b.Sequence;
            });

            activities.forEach( async (activity) => {
                var dayStartStr = activity.ScheduledAt.toISOString();
                var dayStart = TimeHelper.getDateWithTimezone(dayStartStr, timezoneOffset);
                dayStart = TimeHelper.addDuration(dayStart, 7, DurationType.Hour); // Start at 7:00 AM
                var scheduleDelay = (activity.Sequence - 1) * 1;
                var startTime = TimeHelper.addDuration(dayStart, scheduleDelay, DurationType.Second);   // Scheduled at every 1 sec
                var endTime = TimeHelper.addDuration(dayStart, 16, DurationType.Hour);       // End at 11:00 PM

                var userTaskModel: UserTaskDomainModel = {
                    UserId             : activity.PatientUserId,
                    DisplayId          : activity.PlanName + '-' + activity.ProviderActionId,
                    Task               : activity.Title,
                    Category           : activity.Category,
                    Description        : activity.Description,
                    ActionType         : UserActionType.Careplan,
                    ActionId           : activity.id,
                    ScheduledStartTime : startTime,
                    ScheduledEndTime   : endTime
                };

                var userTask = await this._userTaskRepo.create(userTaskModel);

                await this._careplanRepo.setUserTaskToActivity(activity.id, userTask.id);

                Logger.instance().log(`User task dto: ${JSON.stringify(userTask)}`);
                Logger.instance().log(`New user task created for AHA careplan with id: ${userTask.id}`);
            });
        }
    }

    getWeeklyStatus = async (careplanId: uuid): Promise<any> => {

        var enrollment = await this._careplanRepo.getCareplanEnrollment(careplanId);

        var startDate = enrollment.StartAt;
        var endDate = enrollment.EndAt;

        var today = new Date();
        var begin =  new Date(startDate);
        var end =  new Date(endDate);

        var currentWeek = -1;
        var dayOfCurrentWeek = -1;
        var message = "Your careplan is in progress.";

        if (TimeHelper.isBefore(today, begin)) {
            currentWeek = 0;
            dayOfCurrentWeek = 0;
            message = "Your careplan has not yet started.";
            return { currentWeek, dayOfCurrentWeek, message };
        }
        if (TimeHelper.isAfter(today, end)){
            message = "Your careplan has been finished.";
            return { currentWeek, dayOfCurrentWeek, message };
        }

        // current week
        var diff = Math.abs(today.getTime() - begin.getTime());
        var days = Math.floor(diff / (1000 * 3600 * 24));
        currentWeek = (Math.floor(days / 7)) + 1;
        dayOfCurrentWeek = (days % 7) + 1;

        // total weeks
        var duration = Math.abs(end.getTime() - begin.getTime());
        var totalDays = Math.floor(duration / (1000 * 3600 * 24));
        var totalWeeks = (Math.floor(totalDays / 7));

        var careplanStatus = {

            CurrentWeek      : currentWeek,
            DayOfCurrentWeek : dayOfCurrentWeek,
            Message          : message,
            TotalWeeks       : totalWeeks,
            StartDate        : startDate,
            EndDate          : endDate,
        };

        return careplanStatus;
    };

    public updateActivityUserResponse = async (activityId: uuid, userResponse: string):
    Promise<CareplanActivityDto> => {

        return await this._careplanRepo.updateActivityUserResponse(activityId, userResponse);
    };

    //#endregion

}

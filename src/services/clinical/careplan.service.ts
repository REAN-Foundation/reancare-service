import { inject, injectable } from "tsyringe";
import { ICareplanRepo } from "../../database/repository.interfaces/clinical/careplan.repo.interface";
import { IPatientRepo } from "../../database/repository.interfaces/users/patient/patient.repo.interface";
import { IPersonRepo } from "../../database/repository.interfaces/person/person.repo.interface";
import { IUserRepo } from "../../database/repository.interfaces/users/user/user.repo.interface";
import { IAssessmentRepo } from "../../database/repository.interfaces/clinical/assessment/assessment.repo.interface";
import { IAssessmentTemplateRepo } from "../../database/repository.interfaces/clinical/assessment/assessment.template.repo.interface";
import { IAssessmentHelperRepo } from "../../database/repository.interfaces/clinical/assessment/assessment.helper.repo.interface";
import { IUserTaskRepo } from "../../database/repository.interfaces/users/user/user.task.repo.interface";
import { EnrollmentDomainModel } from '../../domain.types/clinical/careplan/enrollment/enrollment.domain.model';
import { EnrollmentDto } from '../../domain.types/clinical/careplan/enrollment/enrollment.dto';
import { ApiError } from "../../common/api.error";
import { CareplanHandler } from '../../modules/careplan/careplan.handler';
import { ProgressStatus, uuid } from "../../domain.types/miscellaneous/system.types";
import { ParticipantDomainModel } from "../../domain.types/clinical/careplan/participant/participant.domain.model";
import { CareplanActivityDomainModel } from "../../domain.types/clinical/careplan/activity/careplan.activity.domain.model";
import { UserTaskCategory } from "../../domain.types/users/user.task/user.task.types";
import { UserActionType } from "../../domain.types/users/user.task/user.task.types";
import { TimeHelper } from "../../common/time.helper";
import { DurationType } from "../../domain.types/miscellaneous/time.types";
import { Logger } from "../../common/logger";
import { IUserActionService } from "../users/user/user.action.service.interface";
import { AssessmentTemplateDto } from "../../domain.types/clinical/assessment/assessment.template.dto";
import { CAssessmentTemplate } from "../../domain.types/clinical/assessment/assessment.types";
import { CareplanActivity } from "../../domain.types/clinical/careplan/activity/careplan.activity";
import { CareplanConfig } from "../../config/configuration.types";
import { AssessmentDomainModel } from "../../domain.types/clinical/assessment/assessment.domain.model";
import { CareplanActivityDto } from "../../domain.types/clinical/careplan/activity/careplan.activity.dto";
import { AssessmentDto } from "../../domain.types/clinical/assessment/assessment.dto";
import { UserTaskDomainModel } from "../../domain.types/users/user.task/user.task.domain.model";
import { Loader } from "../../startup/loader";
import { IDonorRepo } from "./../../database/repository.interfaces/users/donor.repo.interface";
import { IDonationCommunicationRepo } from "../../database/repository.interfaces/clinical/donation/donation.communication.repo.interface";
import { EHRAnalyticsHandler } from "../../modules/ehr.analytics/ehr.analytics.handler";
import { x } from "pdfkit";
import { PatientDetailsDto } from "../../domain.types/users/patient/patient/patient.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class CareplanService implements IUserActionService {

    _handler: CareplanHandler = new CareplanHandler();

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    constructor(
        @inject('ICareplanRepo') private _careplanRepo: ICareplanRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IDonorRepo') private _donorRepo: IDonorRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
        @inject('IAssessmentTemplateRepo') private _assessmentTemplateRepo: IAssessmentTemplateRepo,
        @inject('IAssessmentHelperRepo') private _assessmentHelperRepo: IAssessmentHelperRepo,
        @inject('IDonationCommunicationRepo') private _donationCommunicationRepo: IDonationCommunicationRepo,
        
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
                Phone          : patient.User.Person.Phone,
                Email          : patient.User.Person.Email,
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

        return await this.enrollAndCreateTask(enrollmentDetails);
    };

    private timer = ms => new Promise(res => setTimeout(res, ms));

    public scheduleDailyCareplanPushTasks = async (): Promise<void> => {

        const activities = await this._careplanRepo.getAllReanActivities();
        const scheduledActivities = [];

        if (activities.length !== 0) {
            for (const activity of activities) {

                const todayDateTime = new Date().toISOString()
                    .split('T');
                const activityDateTime = activity.ScheduledAt.toISOString().split('T');

                if (todayDateTime[0] === activityDateTime[0]) {
                    const num = todayDateTime[1].split('.')[0];
                    const num1 = num.split(':',2);
                    const num2 = num1[0].concat(':', num1[1]);

                    const num3 = activityDateTime[1].split('.')[0];
                    const num4 = num3.split(':',2);
                    const num5 = num4[0].concat(':', num4[1]);

                    if (num2 === num5){
                        scheduledActivities.push(activity);
                    }
                }
            }

            for (const activity of scheduledActivities) {
                const message = activity.Description;
                let patient = null;
                if (activity.PlanCode === 'Donor-Reminders') {
                    patient = await this.getDonor(activity.PatientUserId);
                } else {
                    patient = await this.getPatient(activity.PatientUserId);
                }
                let phoneNumber = null;
                if (message.includes("Messages")) {
                    phoneNumber = patient.User.Person.TelegramChatId;
                } else {
                    phoneNumber = patient.User.Person.Phone;
                }
                const payload = { PersonName: patient.User.Person.DisplayName };
                
                //Set fifth day reminder flag true for patient
                if (activity.Type === "reminder_three") {
                    await this._donationCommunicationRepo.create(
                        { PatientUserId: activity.PatientUserId ,FifthDayReminderFlag: true });
                }

                let response = null;
                response = await Loader.messagingService.sendWhatsappWithReanBot(phoneNumber, message,
                    activity.Provider, activity.Type, activity.PlanCode, payload);
                if (response === true) {
                    await this._careplanRepo.updateActivity(activity.id, "Completed", new Date());
                    Logger.instance().log(`Successfully whatsapp message send to ${phoneNumber}`);
                }
                await this.timer(500);
            }
        } else {
            Logger.instance().log(`No activities fetched from careplan task.`);
        }

    };

    public getPatientEligibility = async (patient: any, provider: string, careplanCode: string) => {
        return await this._handler.getPatientEligibility(patient, provider, careplanCode);
    };

    public getPatientEnrollments = async (patientUserId: string, isActive: boolean) => {
        return await this._careplanRepo.getPatientEnrollments(patientUserId, isActive);
    };

    public getCompletedEnrollments = async (daysPassed: number, planNames : string[]) => {
        return await this._careplanRepo.getCompletedEnrollments(daysPassed, planNames);
    };

    public fetchTasks = async (careplanId: uuid): Promise<boolean> => {

        var enrollment = await this._careplanRepo.getCareplanEnrollment(careplanId);

        const enrollmentId = enrollment.EnrollmentId.toString();
        const participantId = enrollment.ParticipantId.toString();

        var activities = await this._handler.fetchActivities(
            enrollment.PatientUserId, enrollment.Provider, enrollment.PlanCode,
            participantId, enrollmentId, enrollment.StartAt, enrollment.EndAt);

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
                Transcription    : x.Transcription,
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
        if (activity != null) {

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
            details.Transcription = activity.Transcription;

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
        }
        else {
            var assessment = await this._assessmentRepo.getById(activityId);
            var dummyActivity = {
                id               : assessment.id,
                Type             : "Assessment",
                Category         : "Assessment",
                ProviderActionId : "Custom-Assessment",
                Title            : assessment.Title,
                Description      : assessment.Description,
                ScheduledAt      : assessment.ScheduledAt,
                Status           : ProgressStatus.Pending,
                Assessment       : assessment,
            };
            return dummyActivity;
        }
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

        // fetch careplan for given activity and check for expiration
        var careplanDetails = await this._careplanRepo.getEnrollmentByEnrollmentId(activity.EnrollmentId.toString());
        if (careplanDetails.EndAt < new Date()) {
            return true;
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

    public getActivities = async (patientUserId: string, startTime: Date, endTime: Date): Promise<CareplanActivityDto[]> => {
        return await this._careplanRepo.getActivities(patientUserId, startTime, endTime);
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

    private async getDonor(donorUserId: uuid) {

        var donorDto = await this._donorRepo.getByUserId(donorUserId);

        var user = await this._userRepo.getById(donorDto.UserId);
        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        donorDto.User = user;
        return donorDto;
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

    public async enrollAndCreateTask(enrollmentDetails ) {

        var enrollmentId = await this._handler.enrollPatientToCarePlan(enrollmentDetails);
        if (!enrollmentId) {
            throw new ApiError(500, 'Error while enrolling patient to careplan');
        }
        enrollmentDetails.EnrollmentId = enrollmentId;

        var dto = await this._careplanRepo.enrollPatient(enrollmentDetails);

        var activities = await this._handler.fetchActivities(
            enrollmentDetails.PatientUserId, enrollmentDetails.Provider, enrollmentDetails.PlanCode,
            enrollmentDetails.ParticipantId, enrollmentId, enrollmentDetails.StartDate, enrollmentDetails.EndDate);

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

        var healthSystemHospitalDetails = await this._patientRepo.getByUserId(dto.PatientUserId);
        var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(dto.PatientUserId);
        if (eligibleAppNames.length > 0) {
            for await (var appName of eligibleAppNames) {
                if (appName == 'HF Helper' && enrollmentDetails.PlanCode == 'HFMotivator') {
                    for await (var careplanActivity of careplanActivities) {
                        this.addEHRRecord(enrollmentDetails.PlanName, enrollmentDetails.PlanCode, careplanActivity, appName, healthSystemHospitalDetails);
                    }
                } else if (appName == 'Heart &amp; Stroke Helper™' && (enrollmentDetails.PlanCode == 'Cholesterol' || enrollmentDetails.PlanCode == 'Stroke')) {
                    for await (var careplanActivity of careplanActivities) {
                        this.addEHRRecord(enrollmentDetails.PlanName, enrollmentDetails.PlanCode, careplanActivity, appName, healthSystemHospitalDetails);
                    }
                } else if (appName == 'REAN HealthGuru' && (enrollmentDetails.PlanCode == 'Cholesterol' || enrollmentDetails.PlanCode == 'Stroke' || enrollmentDetails.PlanCode == 'HFMotivator')) {
                    for await (var careplanActivity of careplanActivities) {
                        this.addEHRRecord(enrollmentDetails.PlanName, enrollmentDetails.PlanCode, careplanActivity, appName, healthSystemHospitalDetails);
                    }
                } else {
                    for await (var careplanActivity of careplanActivities) {
                        this.addEHRRecord(enrollmentDetails.PlanName, enrollmentDetails.PlanCode, careplanActivity, appName, healthSystemHospitalDetails);
                    }
                }
            }
        } else {
            Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${dto.PatientUserId}`);
        }

        //task scheduling
        await this.createScheduledUserTasks(enrollmentDetails.PatientUserId, careplanActivities);

        return dto;
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

        var careplanStatus = {
            CurrentWeek      : currentWeek,
            DayOfCurrentWeek : dayOfCurrentWeek,
            Message          : message,
            TotalWeeks       : 0,
            StartDate        : null,
            EndDate          : null,
        };

        if (TimeHelper.isBefore(today, begin)) {
            careplanStatus.CurrentWeek = 0;
            careplanStatus.DayOfCurrentWeek = 0;
            careplanStatus.Message = "Your careplan has not yet started.";
        } else if (TimeHelper.isAfter(today, end)){
            careplanStatus.Message = "Your careplan has been finished.";
        } else {
            // current week
            var diff = Math.abs(today.getTime() - begin.getTime());
            var days = Math.floor(diff / (1000 * 3600 * 24));
            currentWeek = (Math.floor(days / 7)) + 1;
            dayOfCurrentWeek = (days % 7) + 1;
            careplanStatus.CurrentWeek = currentWeek;
            careplanStatus.DayOfCurrentWeek = dayOfCurrentWeek;
        }
        
        // total weeks
        var duration = Math.abs(end.getTime() - begin.getTime());
        var totalDays = Math.floor(duration / (1000 * 3600 * 24));
        var totalWeeks = (Math.floor(totalDays / 7));

        careplanStatus.TotalWeeks = totalWeeks;
        careplanStatus.StartDate = startDate;
        careplanStatus.EndDate = endDate;

        return careplanStatus;
    };

    public updateActivityUserResponse = async (activityId: uuid, userResponse: string):
    Promise<CareplanActivityDto> => {

        return await this._careplanRepo.updateActivityUserResponse(activityId, userResponse);
    };

    public updateRisk = async (updateRisk: EnrollmentDomainModel): Promise<EnrollmentDto> => {

        const filter = {
            Phone : updateRisk.Phone
        };
        const patient = await this._patientRepo.search(filter);
        if (patient.Items.length === 0) {
            throw new Error('Patient does not exist!');
        }
        updateRisk.PatientUserId = patient.Items[0].UserId;

        return  await this._careplanRepo.updateRisk(updateRisk);
    };

    public scheduleDailyHighRiskCareplan = async (): Promise<boolean> => {

        const provider = "REAN";
        return await this._handler.scheduleDailyHighRiskCareplan(provider);
    };

    public addEHRRecord = (planName: string, planCode : string, model: CareplanActivityDto, appName?: string, healthSystemHospitalDetails?: PatientDetailsDto) => {
            EHRAnalyticsHandler.addCareplanActivityRecord(
                appName,
                model.PatientUserId,
                model.id,
                model.EnrollmentId,     
                model.Provider,               
                planName,      
                planCode,                
                model.Type,            
                model.Category,        
                model.ProviderActionId,
                model.Title,           
                model.Description,     
                model.Url,
                'English',       
                model.ScheduledAt,
                model.CompletedAt,     
                model.Sequence,        
                model.Frequency,       
                model.Status,
                healthSystemHospitalDetails.HealthSystem ? healthSystemHospitalDetails.HealthSystem : null,
                healthSystemHospitalDetails.AssociatedHospital ? healthSystemHospitalDetails.AssociatedHospital : null,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
    };

    //#endregion

}

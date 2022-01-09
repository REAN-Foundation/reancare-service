import { inject, injectable } from "tsyringe";
import { ICareplanRepo } from "../../database/repository.interfaces/careplan/careplan.repo.interface";
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
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { ParticipantDomainModel } from "../../domain.types/clinical/careplan/participant/participant.domain.model";
import { CareplanActivityDomainModel } from "../../domain.types/clinical/careplan/activity/careplan.activity.domain.model";
import { UserTaskCategory } from "../../domain.types/user/user.task/user.task.types";
import { UserActionType } from "../../domain.types/user/user.task/user.task.types";
import { TimeHelper } from "../../common/time.helper";
import { DurationType } from "../../domain.types/miscellaneous/time.types";
import { Logger } from "../../common/logger";
import { IUserActionService } from "../user/user.action.service.interface";
import { AssessmentTemplateDto } from "../../domain.types/clinical/assessment/assessment.template.dto";
import { SAssessment, SAssessmentTemplate } from "../../domain.types/clinical/assessment/assessment.types";
import { CareplanActivity } from "../../domain.types/clinical/careplan/activity/careplan.activity";
import { CareplanConfig } from "../../config/configuration.types";

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
    }

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
                ProviderActionId : x.ProviderActionId,
                Title            : x.Title,
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

        this.createScheduledUserTasks(careplanActivities);

        return dto;
    };

    public completeAction = async (activityId, time, success) => {
        var activity = await this._careplanRepo.getActivity(activityId);
        var updateFields = {
            completedAt : time,
            comments    : "",
            status      : "COMPLETED"
        };
        Logger.instance().log(`Action success: ${success}`);
        var updatedActivity = await this._handler.updateActivity(
            activity.PatientUserId, activity.Provider, activity.PlanCode,
            activity.EnrollmentId, activity.ProviderActionId, updateFields);

        return updatedActivity.CompletedAt ? true : false;
    }

    public cancelAction = async (actionType, actionId) => {
        // @TODO
        Logger.instance().log(`Action type: ${actionType}`);
        Logger.instance().log(`Action is: ${actionId}`);
        return true;
    }

    public createAssessmentTemplate = async (model: CareplanActivity): Promise<AssessmentTemplateDto> => {

        const assessmentActivity = await this._handler.getActivity(
            model.PatientUserId,
            model.Provider,
            model.PlanCode,
            model.EnrollmentId,
            model.ProviderActionId);
        
        if (!assessmentActivity) {
            throw new Error('Invalid careplan activity encountered!');
        }

        if (assessmentActivity.Category !== UserTaskCategory.Assessment) {
            throw new Error('The given careplan activity is not an assessment activity!');
        }

        var existingTemplate = await this._assessmentTemplateRepo.getByProviderAssessmentCode(
            model.Provider, assessmentActivity.ProviderActionId);
        if (existingTemplate) {
            return existingTemplate;
        }
        
        var assessmentTemplate: SAssessmentTemplate =
            await this._handler.convertToAssessmentTemplate(assessmentActivity);

        const templateDto = await this._assessmentHelperRepo.addTemplate(assessmentTemplate);
        return templateDto;
    }

    public updateAssessment = async (assessment: SAssessment): Promise<boolean> => {
        return await this._handler.updateAssessment(assessment);
    }

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

    private async createScheduledUserTasks(careplanActivities) {

        // create user tasks based on activities

        var activitiesGroupedByDate = {};
        for (const activity of careplanActivities) {

            var scheduledDate = TimeHelper.timestamp(activity.ScheduledAt);
            if (!activitiesGroupedByDate[scheduledDate]) {
                activitiesGroupedByDate[scheduledDate] = [];
            }

            activitiesGroupedByDate[scheduledDate].push(activity);
        }

        for (const scheduledDate in activitiesGroupedByDate) {
            var activities = activitiesGroupedByDate[scheduledDate];

            Logger.instance().log(`Creating user tasks for: ${scheduledDate}, total tasks: ${activities.length}`);

            activities.sort((a, b) => {
                return a.Sequence - b.Sequence;
            });

            activities.forEach( async (activity) => {
                var dayStart = TimeHelper.addDuration(activity.ScheduledAt, 7, DurationType.Hour);       // Start at 7:00 AM
                var scheduleDelay = (activity.Sequence - 1) * 1;
                var startTime = TimeHelper.addDuration(dayStart, scheduleDelay, DurationType.Second);   // Scheduled at every 1 sec
                var endTime = TimeHelper.addDuration(activity.ScheduledAt, 23, DurationType.Hour);       // End at 11:00 PM

                var userTaskModel = {
                    UserId             : activity.PatientUserId,
                    DisplayId          : activity.PlanName + '-' + activity.ProviderActionId,
                    Task               : activity.Title,
                    Category           : UserTaskCategory[activity.Type] ?? UserTaskCategory.Custom,
                    Description        : null,
                    ActionType         : UserActionType.Careplan,
                    ActionId           : activity.id,
                    ScheduledStartTime : startTime,
                    ScheduledEndTime   : endTime
                };

                var userTaskDto = await this._userTaskRepo.create(userTaskModel);

                Logger.instance().log(`User task dto: ${JSON.stringify(userTaskDto)}`);
                Logger.instance().log(`New user task created for AHA careplan with id: ${userTaskDto.id}`);
            });
        }
    }
    
    //#endregion

}

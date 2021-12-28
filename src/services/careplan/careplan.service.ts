import { inject, injectable } from "tsyringe";
import { ICareplanRepo } from "../../database/repository.interfaces/careplan/enrollment.repo.interface";
import { EnrollmentDomainModel } from '../../modules/careplan/domain.types/enrollment/enrollment.domain.model';
import { EnrollmentDto } from '../../modules/careplan/domain.types/enrollment/enrollment.dto';
import { IPatientRepo } from "../../database/repository.interfaces/patient/patient.repo.interface";
import { ApiError } from "../../common/api.error";
import { IPersonRepo } from "../../database/repository.interfaces/person.repo.interface";
import { IUserRepo } from "../../database/repository.interfaces/user/user.repo.interface";
import { CareplanHandler } from '../../modules/careplan/careplan.handler';
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { ParticipantDomainModel } from "../../modules/careplan/domain.types/participant/participant.domain.model";
import { CareplanActivityDomainModel } from "../../modules/careplan/domain.types/activity/careplan.activity.domain.model";
import { UserTaskCategory } from "../../domain.types/user/user.task/user.task..types";
import { UserActionType } from "../../domain.types/user/user.task/user.task..types";
import { TimeHelper } from "../../common/time.helper";
import { IUserTaskRepo } from "../../database/repository.interfaces/user/user.task.repo.interface";
import { DurationType } from "../../domain.types/miscellaneous/time.types";
import { Logger } from "../../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class CareplanService {

    _handler: CareplanHandler = new CareplanHandler();

    constructor(
        @inject('ICareplanRepo') private _careplanRepo: ICareplanRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IUserRepo') private _userTaskRepo: IUserTaskRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,

    ) {}

    enrollPatient = async (enrollmentDetails: EnrollmentDomainModel): Promise<EnrollmentDto> => {

        var patient = await this.getPatient(enrollmentDetails.UserId);

        var participantId = null;

        //Check if the participant is already registered with the care plan provider
        var participant = await this._careplanRepo.getPatientRegistrationDetails(
            patient.UserId, enrollmentDetails.Provider);

        if (!participant) {
            //Since not registered with provider, register
            var participantDetails: ParticipantDomainModel = {
                Name           : enrollmentDetails.Name,
                UserId         : enrollmentDetails.UserId,
                Gender         : enrollmentDetails.Gender,
                Age            : null,
                Dob            : enrollmentDetails.BirthDate,
                HeightInInches : null,
                WeightInLbs    : null,
                MaritalStatus  : null,
                ZipCode        : null,
            };
            participantId = await this._handler.registerPatientWithProvider(
                participantDetails, enrollmentDetails.Provider);
        } else {
            participantId = participant.ParticipantId;
        }
        enrollmentDetails.ParticipantId = participantId;
        var enrollmentId = await this._handler.enrollPatientToCarePlan(enrollmentDetails);
        if (!enrollmentId) {
            throw new ApiError(500, 'Error while enrolling patient to careplan');
        }
        
        enrollmentDetails.EnrollmentId = enrollmentId;
        enrollmentDetails.ParticipantId = participantId;
        
        var dto = await this._careplanRepo.enrollPatient(enrollmentDetails);

        var activities = await this._handler.fetchActivities(
            enrollmentDetails.UserId, enrollmentDetails.Provider, enrollmentDetails.PlanCode, enrollmentId,
            enrollmentDetails.StartDate, enrollmentDetails.EndDate);

        const activityModels = activities.map(x => {
            var a: CareplanActivityDomainModel = {
                UserId           : x.UserId,
                EnrollmentId     : x.EnrollmentId,
                ParticipantId    : x.ParticipantIdId,
                Provider         : x.Provider,
                PlanName         : x.PlanName,
                PlanCode         : x.PlanCode,
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
            enrollmentDetails.UserId,
            enrollmentId,
            activityModels);

        //task scheduling

        this.createScheduledUserTasks(careplanActivities);

        return dto;
    };

    private async getPatient(patientUserId: uuid) {

        var patientDto = await this._patientRepo.getByUserId(patientUserId);

        var user = await this._userRepo.getById(patientDto.UserId);
        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        patientDto.User = user;
        return patientDto;
    }
    
    async createScheduledUserTasks(careplanActivities) {
        // creare user.tasks based on activities
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
                    UserId             : activity.UserId,
                    DisplayId          : activity.CareplanName + '-' + activity.ProviderActionId,
                    Task               : activity.Title,
                    Category           : UserTaskCategory[activity.Type] ?? UserTaskCategory.Custom,
                    Description        : null,
                    ActionType         : UserActionType.Careplan,
                    ActionId           : activity.id,
                    ScheduledStartTime : startTime,
                    ScheduledEndTime   : endTime
                };
        
                var userTaskDto = await this._userTaskRepo.create(userTaskModel);
                Logger.instance().log(`New user task created for AHA careplan with id: ${userTaskDto.id}`);
            });
        }
    }

}

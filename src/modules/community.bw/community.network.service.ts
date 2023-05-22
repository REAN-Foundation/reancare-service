import { inject, injectable } from "tsyringe";
import { ICareplanRepo } from "../../database/repository.interfaces/clinical/careplan.repo.interface";
import { IPatientRepo } from "../../database/repository.interfaces/users/patient/patient.repo.interface";
import { IPersonRepo } from "../../database/repository.interfaces/person/person.repo.interface";
import { IUserRepo } from "../../database/repository.interfaces/users/user/user.repo.interface";
import { IUserTaskRepo } from "../../database/repository.interfaces/users/user/user.task.repo.interface";
import { EnrollmentDomainModel } from '../../domain.types/clinical/careplan/enrollment/enrollment.domain.model';
import { EnrollmentDto } from '../../domain.types/clinical/careplan/enrollment/enrollment.dto';
import { CareplanActivityDomainModel } from "../../domain.types/clinical/careplan/activity/careplan.activity.domain.model";
import { UserActionType } from "../../domain.types/users/user.task/user.task.types";
import { TimeHelper } from "../../common/time.helper";
import { DurationType } from "../../domain.types/miscellaneous/time.types";
import { Logger } from "../../common/logger";
import { CareplanActivityDto } from "../../domain.types/clinical/careplan/activity/careplan.activity.dto";
import { UserTaskDomainModel } from "../../domain.types/users/user.task/user.task.domain.model";
import { PatientNetworkService } from "./patient.management/patient.network.service";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { HealthProfileService } from "../../services/users/patient/health.profile.service";
import { Loader } from "../../startup/loader";
import { IDonorRepo } from "../../database/repository.interfaces/users/donor.repo.interface";
import { DonorNetworkService } from "./donor.management/donor.network.service";
import { IPatientDonorsRepo } from "../../database/repository.interfaces/clinical/donation/patient.donors.repo.interface";
import { VolunteerService } from "../../services/users/volunteer.service";
import { IDonationRecordRepo } from "../../database/repository.interfaces/clinical/donation/donation.record.repo.interface";
import { PatientService } from "../../services/users/patient/patient.service";
import { IDonationCommunicationRepo } from "../../database/repository.interfaces/clinical/donation/donation.communication.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class CommunityNetworkService {

    _patientNetworkService: PatientNetworkService = new PatientNetworkService();

    _donorNetworkService: DonorNetworkService = new DonorNetworkService();

    _patientService: PatientService = null;

    _patientHealthProfileService: HealthProfileService = null;

    _volunteerService: VolunteerService = null;

    constructor(
        @inject('ICareplanRepo') private _careplanRepo: ICareplanRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IDonorRepo') private _donorRepo: IDonorRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IPatientDonorsRepo') private _patientDonorsRepo: IPatientDonorsRepo,
        @inject('IDonationRecordRepo') private _donationRecordRepo: IDonationRecordRepo,
        @inject('IDonationCommunicationRepo') private _donationCommunicationRepo: IDonationCommunicationRepo,
    ) { this._patientHealthProfileService = Loader.container.resolve(HealthProfileService);
        this._volunteerService = Loader.container.resolve(VolunteerService);
        this._patientService = Loader.container.resolve(PatientService); }

    public enroll = async (enrollmentDetails: EnrollmentDomainModel): Promise<EnrollmentDto> => {

        let patient = null;
        if (enrollmentDetails.PlanCode === 'Donor-Reminders') {
            patient = await this.getDonor(enrollmentDetails.PatientUserId);
        } else {
            patient = await this.getPatient(enrollmentDetails.PatientUserId);
        }
        if (!patient) {
            throw new Error('Patient does not exist!');
        }

        const provider = enrollmentDetails.Provider;
        const planCode = enrollmentDetails.PlanCode;

        const planDetails = this._patientNetworkService.getPlanDetails(provider, planCode);
        if (!planDetails) {
            throw new Error(`Specified care plan '${provider}-${planCode}' is not available.`);
        }
        const planName = planDetails.DisplayName;
        enrollmentDetails.PlanName = planName;
        var participantId = `${provider}${patient.User.Person.Phone}`;

        //Check if the participant is already registered with the care plan provider
        var participant = await this._careplanRepo.getPatientRegistrationDetails(
            patient.UserId, provider);

        if (!participant) {

            if (!patient.User.Person.Gender || !patient.User.Person.BirthDate) {
                throw new Error('Gender and date of birth need to be specified before enrollment to care plan.');
            }

            //Since not registered with provider, register
            participant = await this._careplanRepo.addPatientWithProvider(
                enrollmentDetails.PatientUserId, provider, participantId);

            if (!participant) {
                throw new Error('Error while adding care plan participant details to database.');
            }
        }

        let patientHealthProfile = null;
        if (enrollmentDetails.PlanCode === 'Patient-Reminders') {
            patientHealthProfile = await this._patientHealthProfileService.getByPatientUserId(
                enrollmentDetails.PatientUserId);
        }

        enrollmentDetails.ParticipantId = participant.ParticipantId;
        enrollmentDetails.Gender = patient.User.Person.Gender;
        enrollmentDetails.EnrollmentId = participant.ParticipantId;
        
        var dto = await this._careplanRepo.enrollPatient(enrollmentDetails);

        if (enrollmentDetails.PlanCode === 'Patient-Reminders') {
            var activities = await this._patientNetworkService.fetchActivities(
                enrollmentDetails.PlanCode, enrollmentDetails.ParticipantId, enrollmentDetails.EnrollmentId,
                enrollmentDetails.StartDate, patientHealthProfile.BloodTransfusionDate, enrollmentDetails.EndDate);
        } else {
            var activities = await this._donorNetworkService.fetchActivities(
                enrollmentDetails.PlanCode, enrollmentDetails.ParticipantId, enrollmentDetails.EnrollmentId,
                enrollmentDetails.StartDate, enrollmentDetails.EndDate);
        }
        
        Logger.instance().log(`Activities: ${JSON.stringify(activities)}`);

        const activityModels = activities.map(x => {

            var a: CareplanActivityDomainModel = {
                PatientUserId    : enrollmentDetails.PatientUserId,
                EnrollmentId     : enrollmentDetails.EnrollmentId,
                ParticipantId    : enrollmentDetails.ParticipantId,
                Provider         : enrollmentDetails.Provider,
                PlanName         : enrollmentDetails.PlanName,
                PlanCode         : enrollmentDetails.PlanCode,
                Type             : x.Type,
                Category         : x.Category,
                ProviderActionId : x.ProviderActionId,
                Title            : x.Title,
                Description      : JSON.stringify(x.Description),
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
            enrollmentDetails.EnrollmentId,
            activityModels);

        Logger.instance().log(`Careplan Activities: ${JSON.stringify(careplanActivities)}`);

        //task scheduling

        await this.createScheduledUserTasks(enrollmentDetails.PatientUserId, careplanActivities);

        return dto;
    };
    
    public fetchTasks = async (careplanId: uuid): Promise<boolean> => {

        var enrollment = await this._careplanRepo.getCareplanEnrollment(careplanId);

        const enrollmentId = enrollment.EnrollmentId.toString();
        const participantId = enrollment.ParticipantId.toString();

        var activities = await this._patientNetworkService.fetchActivities(
            enrollment.PlanCode, participantId, enrollmentId, enrollment.StartAt, enrollment.EndAt);

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

    public reminderOnNoActionToDonationRequest = async (): Promise<void> => {

        try {
            const patients = await this._patientService.search({ "DonorAcceptance": "Send" });

            if (patients.Items.length !== 0) {
                for (const patient of patients.Items) {
                    let volunteerUserId = null;
                    if (patient.FirstName === "dummy_patient") {
                        const donationRecord = await this._donationRecordRepo.search({ "PatientUserId": patient.UserId });
                        volunteerUserId = donationRecord.Items[0].VolunteerOfEmergencyDonor;

                    } else {
                        const bloodBridge = await this._patientDonorsRepo.search({ "PatientUserId": patient.UserId });
                        volunteerUserId = bloodBridge.Items[0].VolunteerUserId;
                    }
                    const volunteer = await this._volunteerService.getByUserId( volunteerUserId );
                    const phoneNumber = volunteer.User.Person.Phone;
                    const message = {
                        Variables  : [],
                        ButtonsIds : [
                            "Donation_Request_Yes",
                            "Send_OneTimeDonor"
                        ]
                    };
                    let response = null;
                    response = await Loader.messagingService.sendWhatsappWithReanBot(phoneNumber, JSON.stringify(message),
                        "REAN_BW", "donor_request_ignored", "Volunteer-Reminders");

                    if (response === true) {
                        await this._patientRepo.updateByUserId( patient.UserId ,{ "DonorAcceptance": "NotSend" });
                        Logger.instance().log(`Successfully whatsapp message send to volunteer ${phoneNumber}`);
                    }
                }
                
            } else {
                Logger.instance().log(`Donation request not found or Donor has responded to request.`);
            }
        } catch (error) {
            Logger.instance().log(`No action to donation request error ${error.message}`);
        }

    };

    public reminderOnNoActionToFifthDayReminder = async (): Promise<void> => {
        try {
            const donationCommunications = await this._donationCommunicationRepo.search({});

            if (donationCommunications.Items.length !== 0) {
                for (const donationCommunication of donationCommunications.Items) {
                    if (donationCommunication.FifthDayReminderFlag === true) {

                        const patient = await this._patientService.getByUserId( donationCommunication.PatientUserId );

                        const bloodBridge = await this._patientDonorsRepo.search({ "PatientUserId": patient.UserId });
                        const volunteerUserId = bloodBridge.Items[0].VolunteerUserId;
                        const volunteer = await this._volunteerService.getByUserId( volunteerUserId );
                        const phoneNumber = volunteer.User.Person.Phone;
                        const message = {
                            Variables : [{
                                "type" : "text",
                                "text" : volunteer.User.Person.DisplayName
                            },
                            {
                                "type" : "text",
                                "text" : patient.HealthProfile.BloodTransfusionDate.toDateString(),
                            },
                            {
                                "type" : "text",
                                "text" : patient.User.Person.DisplayName
                            }]
                        };
                        let response = null;
                        response = await Loader.messagingService.sendWhatsappWithReanBot(phoneNumber,JSON.stringify(message),
                            "REAN_BW", "patient_fifthday_ignored_volunteer", "Volunteer-Reminders");

                        if (response === true) {
                            await this._donationCommunicationRepo.update( donationCommunication.id ,{ "FifthDayReminderFlag": false });
                            Logger.instance().log(`Successfully whatsapp message send to patient ${phoneNumber}`);
                        }
                    }
                }
                
            } else {
                Logger.instance().log(`Fifth day reminder not found or Patient has responded to reminder.`);
            }
        } catch (error) {
            Logger.instance().log(`No action to fifth day reminder error ${error.message}`);
        }

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
                Logger.instance().log(`New user task created for Blood Warrior with id: ${userTask.id}`);
            });
        }
    }

    public updateActivityUserResponse = async (activityId: uuid, userResponse: string):
    Promise<CareplanActivityDto> => {

        return await this._careplanRepo.updateActivityUserResponse(activityId, userResponse);
    };

    //#endregion

}

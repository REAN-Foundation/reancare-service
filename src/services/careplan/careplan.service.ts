import { inject, injectable } from "tsyringe";
import { ICareplanRepo } from "../../database/repository.interfaces/careplan/careplan.repo.interface";
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
import { Helper } from "../../common/helper";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class CareplanService {

    _handler: CareplanHandler = new CareplanHandler();

    constructor(
        @inject('ICareplanRepo') private _careplanRepo: ICareplanRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,

    ) {}

    enroll = async (enrollmentDetails: EnrollmentDomainModel): Promise<EnrollmentDto> => {

        var patient = await this.getPatient(enrollmentDetails.PatientUserId);
        if (!patient) {
            throw new Error('Patient does not exist!');
        }

        var participantId = null;

        //Check if the participant is already registered with the care plan provider
        var participant = await this._careplanRepo.getPatientRegistrationDetails(
            patient.UserId, enrollmentDetails.Provider);

        if (!participant) {

            if (!patient.User.Person.Gender || !patient.User.Person.BirthDate) {
                throw new Error('Gender and date of birth need to be specified before enrollment to care plan.');
            }

            //Since not registered with provider, register
            var participantDetails: ParticipantDomainModel = {
                Name           : patient.User.Person.DisplayName,
                UserId         : enrollmentDetails.PatientUserId,
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
            enrollmentDetails.PatientUserId, enrollmentDetails.Provider, enrollmentDetails.PlanCode, enrollmentId,
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

        await this._careplanRepo.addActivities(
            enrollmentDetails.Provider,
            enrollmentDetails.PlanName,
            enrollmentDetails.PlanCode,
            enrollmentDetails.PatientUserId,
            enrollmentId,
            activityModels);

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
    
}

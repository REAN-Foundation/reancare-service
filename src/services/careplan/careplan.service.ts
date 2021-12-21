import { inject, injectable } from "tsyringe";
import { ICareplanRepo } from "../../database/repository.interfaces/careplan/enrollment.repo.interface";
import { EnrollmentDomainModel } from '../../modules/careplan/domain.types/enrollment/enrollment.domain.model';
import { EnrollmentDto } from '../../modules/careplan/domain.types/enrollment/enrollment.dto';
import { IPatientRepo } from "../../database/repository.interfaces/patient/patient.repo.interface";
import { Loader } from '../../startup/loader';
import { ApiError } from "../../common/api.error";
import { IPersonRepo } from "../../database/repository.interfaces/person.repo.interface";
import { IUserRepo } from "../../database/repository.interfaces/user/user.repo.interface";
import { CareplanHandler } from '../../modules/careplan/careplan.handler';
import { uuid } from "../../domain.types/miscellaneous/system.types";

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

    enrollParticipant = async (enrollmentDetails: EnrollmentDomainModel): Promise<EnrollmentDto> => {

        var patient = await this.getPatient(enrollmentDetails.UserId);

        //Check if the participant is already registered with the care plan provider
        var participant = await this._careplanRepo.getParticipantDetails(patient.UserId, enrollmentDetails.Provider);
        if(!participant) {
            //Since not registered with provider, register
            var registrationDetails = await this._handler.registerParticipant()
        }
        var enrollment = await this._handler.enrollPatientToCarePlan(patient, enrollmentDetails);

        if (!enrollment) {
            throw new ApiError(500, 'Error while enrolling patient to careplan');
        }
        
        enrollmentDetails.EnrollmentId = enrollment.id;
        enrollmentDetails.ParticipantId = enrollment.participantId;
        
        var dto = await this._careplanRepo.enrollParticipant(enrollmentDetails);
        Loader.carePlanService.fetchTasks(dto);

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

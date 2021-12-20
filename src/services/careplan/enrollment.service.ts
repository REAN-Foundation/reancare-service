import { inject, injectable } from "tsyringe";
import { ICareplanRepo } from "../../database/repository.interfaces/careplan/enrollment.repo.interface";
import { EnrollmentDomainModel } from '../../modules/careplan/domain.types/enrollment/enrollment.domain.model';
import { EnrollmentDto } from '../../modules/careplan/domain.types/enrollment/enrollment.dto';
import { IPatientRepo } from "../../database/repository.interfaces/patient/patient.repo.interface";
import { Loader } from '../../startup/loader';
import { ApiError } from "../../common/api.error";
import { IPersonRepo } from "../../database/repository.interfaces/person.repo.interface";
import { IUserRepo } from "../../database/repository.interfaces/user/user.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EnrollmentService {

    constructor(
        @inject('IEnrollmentRepo') private _enrollmentRepo: ICareplanRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,

    ) {}

    enroll = async (enrollmentDomainModel: EnrollmentDomainModel): Promise<EnrollmentDto> => {
        var patientDto = await this._patientRepo.getByUserId(enrollmentDomainModel.UserId);

        var user = await this._userRepo.getById(patientDto.UserId);
        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        patientDto.User = user;

        var enrollment = await Loader.carePlanService.enrollPatientToCarePlan(patientDto, enrollmentDomainModel);

        if (!enrollment) {
            throw new ApiError(500, 'Error while enrolling patient to careplan');
        }
        
        enrollmentDomainModel.EnrollmentId = enrollment.id;
        enrollmentDomainModel.ParticipantId = enrollment.participantId;
        
        var dto = await this._enrollmentRepo.enroll(enrollmentDomainModel);
        Loader.carePlanService.fetchTasks(dto);

        return dto;
    };

}

import { Loader } from '../startup/loader';
import { IPatientRepo } from '../data/repository.interfaces/patient.repo.interface';
import { IUserRepo } from '../data/repository.interfaces/user.repo.interface';
import { IUserRoleRepo } from '../data/repository.interfaces/user.role.repo.interface';
import { IRoleRepo } from '../data/repository.interfaces/role.repo.interface';
import { IOtpRepo } from '../data/repository.interfaces/otp.repo.interface';
import { IMessagingService } from '../modules/communication/interfaces/messaging.service.interface';
import { UserDto, UserDtoLight, UserSearchFilters, UserLoginRequestDto } from '../data/domain.types/user.domain.types';
import { PatientDomainModel, PatientDto, PatientDtoLight } from '../data/domain.types/patient.domain.types';
import { injectable, inject } from 'tsyringe';
import { Logger } from '../common/logger';
import { ApiError } from '../common/api.error';
import { Roles } from '../data/domain.types/role.domain.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PatientService {
    constructor(
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IUserRoleRepo') private _userRoleRepo: IUserRoleRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
        @inject('IOtpRepo') private _otpRepo: IOtpRepo,
        @inject('IMessagingService') private _messagingService: IMessagingService
    ) {}

    create = async (createModel: PatientDomainModel): Promise<PatientDto> => {
        // var entity = {
        //     FirstName: requestDto.FirstName,
        //     LastName: requestDto.LastName,
        //     Prefix: requestDto.Prefix,
        //     Phone: requestDto.Phone,
        //     Email: requestDto.Email ? requestDto.Email : null,
        //     UserName: requestDto.UserName,
        //     Password: requestDto.Password,
        // };

        return await this._patientRepo.create(createModel);
    };

    public getByUserId = async (id: string): Promise<PatientDto> => {
        return await this._patientRepo.getByUserId(id);
    };

    public search = async (
        filters: UserSearchFilters,
        full: boolean = false
    ): Promise<PatientDto[] | PatientDtoLight[]> => {
        if (full) {
            return await this._patientRepo.searchFull(filters);
        } else {
            return await this._patientRepo.searchLight(filters);
        }
    };

    public updateByUserId = async (id: string, updateModel: PatientDomainModel): Promise<PatientDto> => {
        return await this._patientRepo.updateByUserId(id, updateModel);
    };
}

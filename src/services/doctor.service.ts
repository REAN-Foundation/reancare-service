import { Loader } from '../startup/loader';
import { IDoctorRepo } from '../database/repository.interfaces/doctor.repo.interface';
import { IUserRepo } from '../database/repository.interfaces/user.repo.interface';
import { IPersonRoleRepo } from '../database/repository.interfaces/person.role.repo.interface';
import { IRoleRepo } from '../database/repository.interfaces/role.repo.interface';
import { IOtpRepo } from '../database/repository.interfaces/otp.repo.interface';
import { IMessagingService } from '../modules/communication/interfaces/messaging.service.interface';
import { injectable, inject } from 'tsyringe';
import { ApiError } from '../common/api.error';
import { Roles } from '../domain.types/role/role.types';
import { DoctorStore } from '../modules/ehr/services/doctor.store';
import { IPersonRepo } from '../database/repository.interfaces/person.repo.interface';
import { DoctorDomainModel } from '../domain.types/doctor/doctor.domain.model';
import { DoctorDetailsDto } from '../domain.types/doctor/doctor.dto';
import { DoctorSearchFilters, DoctorDetailsSearchResults, DoctorSearchResults } from '../domain.types/doctor/doctor.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DoctorService {

    _ehrDoctorStore: DoctorStore = null;

    constructor(
        @inject('IDoctorRepo') private _doctorRepo: IDoctorRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IPersonRoleRepo') private _personRoleRepo: IPersonRoleRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
        @inject('IOtpRepo') private _otpRepo: IOtpRepo,
        @inject('IMessagingService') private _messagingService: IMessagingService
    ) {
        this._ehrDoctorStore = Loader.container.resolve(DoctorStore);
    }

    create = async (doctorDomainModel: DoctorDomainModel): Promise<DoctorDetailsDto> => {
        
        const ehrId = await this._ehrDoctorStore.create(doctorDomainModel);
        doctorDomainModel.EhrId = ehrId;

        const doctorDto = await this._doctorRepo.create(doctorDomainModel);
        const role = await this._roleRepo.getByName(Roles.Doctor);
        await this._personRoleRepo.addPersonRole(doctorDto.User.Person.id, role.id);

        return doctorDto;
    };

    public getByUserId = async (id: string): Promise<DoctorDetailsDto> => {
        return await this._doctorRepo.getByUserId(id);
    };

    public search = async (
        filters: DoctorSearchFilters
    ): Promise<DoctorDetailsSearchResults | DoctorSearchResults> => {
        return await this._doctorRepo.search(filters);
    };

    public updateByUserId = async (
        id: string,
        updateModel: DoctorDomainModel
    ): Promise<DoctorDetailsDto> => {
        return await this._doctorRepo.updateByUserId(id, updateModel);
    };

    public doctorExists = async (domainModel: DoctorDomainModel): Promise<boolean> => {

        const role = await this._roleRepo.getByName(Roles.Doctor);
        if (role == null) {
            throw new ApiError(404, 'Role- ' + Roles.Doctor + ' does not exist!');
        }
        const persons = await this._personRepo.getAllPersonsWithPhoneAndRole(
            domainModel.User.Person.Phone,
            role.id
        );
        if (persons.length > 0) {
            return true;
        }
        return false;
    };

}

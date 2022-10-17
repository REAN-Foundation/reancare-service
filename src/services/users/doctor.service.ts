import { ConfigurationManager } from '../../config/configuration.manager';
import { inject, injectable } from 'tsyringe';
import { ApiError } from '../../common/api.error';
import { IAddressRepo } from '../../database/repository.interfaces/general/address.repo.interface';
import { IDoctorRepo } from '../../database/repository.interfaces/users/doctor.repo.interface';
import { IOrganizationRepo } from '../../database/repository.interfaces/general/organization.repo.interface';
import { IOtpRepo } from '../../database/repository.interfaces/users/user/otp.repo.interface';
import { IPersonRepo } from '../../database/repository.interfaces/person/person.repo.interface';
import { IPersonRoleRepo } from '../../database/repository.interfaces/person/person.role.repo.interface';
import { IRoleRepo } from '../../database/repository.interfaces/role/role.repo.interface';
import { IUserRepo } from '../../database/repository.interfaces/users/user/user.repo.interface';
import { DoctorDomainModel } from '../../domain.types/users/doctor/doctor.domain.model';
import { DoctorDetailsDto, DoctorDto } from '../../domain.types/users/doctor/doctor.dto';
import { DoctorDetailsSearchResults, DoctorSearchFilters, DoctorSearchResults } from '../../domain.types/users/doctor/doctor.search.types';
import { Roles } from '../../domain.types/role/role.types';
import { DoctorStore } from '../../modules/ehr/services/doctor.store';
import { Loader } from '../../startup/loader';

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
        @inject('IAddressRepo') private _addressRepo: IAddressRepo,
        @inject('IOrganizationRepo') private _organizationRepo: IOrganizationRepo
    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrDoctorStore = Loader.container.resolve(DoctorStore);
        }
    }

    //#region Publics

    create = async (doctorDomainModel: DoctorDomainModel): Promise<DoctorDetailsDto> => {

        if (this._ehrDoctorStore) {
            const ehrId = await this._ehrDoctorStore.create(doctorDomainModel);
            doctorDomainModel.EhrId = ehrId;
        }

        var dto = await this._doctorRepo.create(doctorDomainModel);
        dto = await this.updateDetailsDto(dto);
        const role = await this._roleRepo.getByName(Roles.Doctor);
        await this._personRoleRepo.addPersonRole(dto.User.Person.id, role.id);

        return dto;
    };

    public getByUserId = async (id: string): Promise<DoctorDetailsDto> => {
        var dto = await this._doctorRepo.getByUserId(id);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public search = async (
        filters: DoctorSearchFilters
    ): Promise<DoctorDetailsSearchResults | DoctorSearchResults> => {
        var items = [];
        var results = await this._doctorRepo.search(filters);
        for await (var dto of results.Items) {
            dto = await this.updateDto(dto);
            items.push(dto);
        }
        results.Items = items;
        return results;
    };

    public updateByUserId = async (
        id: string,
        updateModel: DoctorDomainModel
    ): Promise<DoctorDetailsDto> => {
        var dto = await this._doctorRepo.updateByUserId(id, updateModel);
        dto = await this.updateDetailsDto(dto);
        return dto;
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

    //#endregion

    //#region Privates

    private updateDetailsDto = async (dto: DoctorDetailsDto): Promise<DoctorDetailsDto> => {
        if (dto == null) {
            return null;
        }
        var user = await this._userRepo.getById(dto.UserId);
        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        const addresses = await this._organizationRepo.getAddresses(user.Person.id);
        const organizations = await this._personRepo.getOrganizations(user.Person.id);
        dto.User = user;
        dto.Addresses = addresses;
        dto.Organizations = organizations;
        return dto;
    };

    private updateDto = async (dto: DoctorDto): Promise<DoctorDto> => {
        if (dto == null) {
            return null;
        }
        const user = await this._userRepo.getById(dto.UserId);
        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        dto.DisplayName = user.Person.DisplayName;
        dto.UserName = user.UserName;
        dto.Phone = user.Person.Phone;
        dto.Email = user.Person.Email;
        dto.Gender = user.Person.Gender;
        dto.BirthDate = user.Person.BirthDate;
        dto.Age = user.Person.Age;
        return dto;
    };

    //#endregion

}

import { Loader } from '../startup/loader';
import { IPatientRepo } from '../database/repository.interfaces/patient.repo.interface';
import { IUserRepo } from '../database/repository.interfaces/user.repo.interface';
import { IPersonRoleRepo } from '../database/repository.interfaces/person.role.repo.interface';
import { IRoleRepo } from '../database/repository.interfaces/role.repo.interface';
import { IAddressRepo } from '../database/repository.interfaces/address.repo.interface';
import { injectable, inject } from 'tsyringe';
import { ApiError } from '../common/api.error';
import { Roles } from '../domain.types/role/role.types';
import { PatientStore } from '../modules/ehr/services/patient.store';
import { IPersonRepo } from '../database/repository.interfaces/person.repo.interface';
import { Helper } from '../common/helper';
import { PatientDomainModel } from '../domain.types/patient/patient.domain.model';
import { PatientDetailsDto, PatientDto } from '../domain.types/patient/patient.dto';
import { PatientSearchFilters, PatientDetailsSearchResults, PatientSearchResults } from '../domain.types/patient/patient.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PatientService {

    _ehrPatientStore: PatientStore = null;

    constructor(
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IPersonRoleRepo') private _personRoleRepo: IPersonRoleRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo,
        @inject('IAddressRepo') private _addressRepo: IAddressRepo,
    ) {
        this._ehrPatientStore = Loader.container.resolve(PatientStore);
    }

    //#region Publics
    
    create = async (patientDomainModel: PatientDomainModel): Promise<PatientDetailsDto> => {
        const ehrId = await this._ehrPatientStore.create(patientDomainModel);
        patientDomainModel.EhrId = ehrId;

        var dto = await this._patientRepo.create(patientDomainModel);
        dto = await this.updateDetailsDto(dto);
        const role = await this._roleRepo.getByName(Roles.Patient);
        await this._personRoleRepo.addPersonRole(dto.User.Person.id, role.id);

        return dto;
    };

    public getByUserId = async (id: string): Promise<PatientDetailsDto> => {
        var dto = await this._patientRepo.getByUserId(id);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public search = async (
        filters: PatientSearchFilters
    ): Promise<PatientDetailsSearchResults | PatientSearchResults> => {
        var items = [];
        var results = await this._patientRepo.search(filters);
        for await (var dto of results.Items) {
            dto = await this.updateDto(dto);
            items.push(dto);
        }
        results.Items = items;
        return results;
    };

    public updateByUserId = async (id: string, updateModel: PatientDomainModel): Promise<PatientDetailsDto> => {
        var dto = await this._patientRepo.updateByUserId(id, updateModel);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public checkforDuplicatePatients = async (domainModel: PatientDomainModel): Promise<number> => {
        const role = await this._roleRepo.getByName(Roles.Patient);
        if (role == null) {
            throw new ApiError(404, 'Role- ' + Roles.Patient + ' does not exist!');
        }
        const persons = await this._personRepo.getAllPersonsWithPhoneAndRole(domainModel.User.Person.Phone, role.id);

        let displayName = Helper.constructPersonDisplayName(
            domainModel.User.Person.Prefix,
            domainModel.User.Person.FirstName,
            domainModel.User.Person.LastName
        );
        displayName = displayName.toLowerCase();

        //compare display name with all users sharing same phone number
        for (const person of persons) {
            const name = person.DisplayName.toLowerCase();
            if (name === displayName) {
                throw new ApiError(409, 'Patient with same name and phone number exists!');
            }
        }
        return persons.length;
    };

    //#endregion

    //#region Privates

    private updateDetailsDto = async (dto: PatientDetailsDto): Promise<PatientDetailsDto> => {
        if (dto == null) {
            return null;
        }
        var user = await this._userRepo.getById(dto.UserId);
        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        const addresses = await this._personRepo.getAddresses(user.PersonId);
        dto.User = user;
        dto.Addresses = addresses;
        return dto;
    };

    private updateDto = async (dto: PatientDto): Promise<PatientDto> => {
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

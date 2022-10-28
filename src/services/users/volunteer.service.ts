import { inject, injectable } from 'tsyringe';
import { ApiError } from '../../common/api.error';
import { IPersonRepo } from '../../database/repository.interfaces/person/person.repo.interface';
import { IPersonRoleRepo } from '../../database/repository.interfaces/person/person.role.repo.interface';
import { IRoleRepo } from '../../database/repository.interfaces/role/role.repo.interface';
import { IUserRepo } from '../../database/repository.interfaces/users/user/user.repo.interface';
import { Roles } from '../../domain.types/role/role.types';
import { VolunteerDetailsDto, VolunteerDto } from '../../domain.types/users/Volunteer/volunteer.dto';
import { VolunteerDetailsSearchResults, VolunteerSearchFilters,
    VolunteerSearchResults } from '../../domain.types/users/Volunteer/volunteer.search.types';
import { VolunteerDomainModel } from '../../domain.types/users/Volunteer/volunteer.domain.model';
import { IVolunteerRepo } from '../../database/repository.interfaces/users/Volunteer.repo.interface';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class VolunteerService {

    constructor(
        @inject('IVolunteerRepo') private _volunteerRepo: IVolunteerRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IPersonRoleRepo') private _personRoleRepo: IPersonRoleRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo
    ) {}

    //#region Publics

    create = async (volunteerDomainModel: VolunteerDomainModel): Promise<VolunteerDetailsDto> => {

        var dto = await this._volunteerRepo.create(volunteerDomainModel);
        dto = await this.updateDetailsDto(dto);
        const role = await this._roleRepo.getByName(Roles.Volunteer);
        await this._personRoleRepo.addPersonRole(dto.User.Person.id, role.id);

        return dto;
    };

    public getByUserId = async (id: string): Promise<VolunteerDetailsDto> => {
        var dto = await this._volunteerRepo.getByUserId(id);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public search = async (
        filters: VolunteerSearchFilters
    ): Promise<VolunteerDetailsSearchResults | VolunteerSearchResults> => {
        var items = [];
        var results = await this._volunteerRepo.search(filters);
        for await (var dto of results.Items) {
            dto = await this.updateDto(dto);
            items.push(dto);
        }
        results.Items = items;
        return results;
    };

    public updateByUserId = async (
        id: string,
        updateModel: VolunteerDomainModel
    ): Promise<VolunteerDetailsDto> => {
        var dto = await this._volunteerRepo.updateByUserId(id, updateModel);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public volunteerExists = async (domainModel: VolunteerDomainModel): Promise<boolean> => {

        const role = await this._roleRepo.getByName(Roles.Volunteer);
        if (role == null) {
            throw new ApiError(404, 'Role- ' + Roles.Volunteer + ' does not exist!');
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

    public deleteByUserId = async (id: string): Promise<boolean> => {
        return await this._volunteerRepo.deleteByUserId(id);
    };

    //#endregion

    //#region Privates

    private updateDetailsDto = async (dto: VolunteerDetailsDto): Promise<VolunteerDetailsDto> => {
        if (dto == null) {
            return null;
        }
        var user = await this._userRepo.getById(dto.UserId);
        if (user.Person == null) {
            user.Person = await this._personRepo.getById(user.PersonId);
        }
        const address = await this._personRepo.getAddresses(user.Person.id);
        dto.User = user;
        dto.Address = address;
        return dto;
    };

    private updateDto = async (dto: VolunteerDto): Promise<VolunteerDto> => {
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

import { inject, injectable } from 'tsyringe';
import { ApiError } from '../../common/api.error';
import { IPersonRepo } from '../../database/repository.interfaces/person/person.repo.interface';
import { IPersonRoleRepo } from '../../database/repository.interfaces/person/person.role.repo.interface';
import { IRoleRepo } from '../../database/repository.interfaces/role/role.repo.interface';
import { IUserRepo } from '../../database/repository.interfaces/users/user/user.repo.interface';
import { Roles } from '../../domain.types/role/role.types';
import { DonorDomainModel } from '../../domain.types/users/donor/donor.domain.model';
import { DonorDetailsDto, DonorDto } from '../../domain.types/users/donor/donor.dto';
import { DonorSearchFilters, DonorDetailsSearchResults, DonorSearchResults } from '../../domain.types/users/donor/donor.search.types';
import { IDonorRepo } from '../../database/repository.interfaces/users/donor.repo.interface';
import { TimeHelper } from '../../common/time.helper';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class DonorService {

    constructor(
        @inject('IDonorRepo') private _donorRepo: IDonorRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IPersonRoleRepo') private _personRoleRepo: IPersonRoleRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo
    ) {}

    //#region Publics

    create = async (donorDomainModel: DonorDomainModel): Promise<DonorDetailsDto> => {

        var dto = await this._donorRepo.create(donorDomainModel);
        dto = await this.updateDetailsDto(dto);
        const role = await this._roleRepo.getByName(Roles.Donor);
        await this._personRoleRepo.addPersonRole(dto.User.Person.id, role.id);

        return dto;
    };

    public getByUserId = async (id: string): Promise<DonorDetailsDto> => {
        var dto = await this._donorRepo.getByUserId(id);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public search = async (
        filters: DonorSearchFilters
    ): Promise<DonorDetailsSearchResults | DonorSearchResults> => {
        var items = [];
        var results = await this._donorRepo.search(filters);
        for await (var dto of results.Items) {
            dto = await this.updateDto(dto);
            if (filters.OnlyEligible === 'true') {
                dto = await this.eligibleDonors(dto);
                if (dto == null) {
                    continue;
                }
            }
            items.push(dto);
        }
        results.Items = items;
        results.RetrievedCount = items.length;
        return results;
    };

    public updateByUserId = async (
        id: string,
        updateModel: DonorDomainModel
    ): Promise<DonorDetailsDto> => {
        var dto = await this._donorRepo.updateByUserId(id, updateModel);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public donorExists = async (domainModel: DonorDomainModel): Promise<boolean> => {

        const role = await this._roleRepo.getByName(Roles.Donor);
        if (role == null) {
            throw new ApiError(404, 'Role- ' + Roles.Donor + ' does not exist!');
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
        return await this._donorRepo.deleteByUserId(id);
    };

    //#endregion

    //#region Privates

    private updateDetailsDto = async (dto: DonorDetailsDto): Promise<DonorDetailsDto> => {
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

    private updateDto = async (dto: DonorDto): Promise<DonorDto> => {
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

    private eligibleDonors = async (dto: DonorDto): Promise<DonorDto > => {
        if (dto == null) {
            return null;
        }
        if (dto.Gender === 'Male' ) {
            const dayDiff = Math.floor(TimeHelper.dayDiff(new Date(), dto.LastDonationDate));
            return dayDiff > 90 ? dto : null;
        }
        else if (dto.Gender === 'Female' ) {
            const dayDiff = Math.floor(TimeHelper.dayDiff(new Date(), dto.LastDonationDate));
            return dayDiff > 120 ? dto : null;
        }
    };

    //#endregion

}

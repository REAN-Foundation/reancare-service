import { AddressDto } from "../../domain.types/general/address/address.dto";
import { inject, injectable } from "tsyringe";
import { IOrganizationRepo } from "../../database/repository.interfaces/general/organization.repo.interface";
import { OrganizationDomainModel } from '../../domain.types/general/organization/organization.domain.model';
import { OrganizationDto } from '../../domain.types/general/organization/organization.dto';
import { OrganizationSearchFilters, OrganizationSearchResults } from '../../domain.types/general/organization/organization.search.types';
import { IUserRepo } from '../../database/repository.interfaces/users/user/user.repo.interface';
import { IAddressRepo } from '../../database/repository.interfaces/general/address.repo.interface';
import { PersonDto } from "../../domain.types/person/person.dto";
import { IPersonRepo } from "../../database/repository.interfaces/person/person.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class OrganizationService {

    //#region Publics

    constructor(
        @inject('IOrganizationRepo') private _organizationRepo: IOrganizationRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IAddressRepo') private _addressRepo: IAddressRepo,
    ) {}

    create = async (organizationDomainModel: OrganizationDomainModel): Promise<OrganizationDto> => {
        var dto = await this._organizationRepo.create(organizationDomainModel);
        dto = await this.updateDto(dto);
        return dto;
    };

    getById = async (id: string): Promise<OrganizationDto> => {
        var organization = await this._organizationRepo.getById(id);
        const addresses = await this._addressRepo.getAddressesForOrganization(organization.id);
        organization['Addresses'] = addresses;
        return organization;
    };

    getByContactUserId = async (contactUserId: string): Promise<OrganizationDto[]> => {
        var dtos = await this._organizationRepo.getByContactUserId(contactUserId);
        var updatedDtos = [];
        for await (var dto of dtos) {
            dto = await this.updateDto(dto);
            updatedDtos.push(dto);
        }
        return updatedDtos;
    };

    search = async (filters: OrganizationSearchFilters): Promise<OrganizationSearchResults> => {
        var items = [];
        var results = await this._organizationRepo.search(filters);
        for await (var dto of results.Items) {
            dto = await this.updateDto(dto);
            items.push(dto);
        }
        results.Items = items;
        return results;
    };

    update = async (id: string, organizationDomainModel: OrganizationDomainModel): Promise<OrganizationDto> => {
        var dto = await this._organizationRepo.update(id, organizationDomainModel);
        dto = await this.updateDto(dto);
        return dto;
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._organizationRepo.delete(id);
    };

    addAddress = async (id: string, addressId: string): Promise<boolean> => {
        return await this._organizationRepo.addAddress(id, addressId);
    };

    removeAddress = async (id: string, addressId: string): Promise<boolean> => {
        return await this._organizationRepo.removeAddress(id, addressId);
    };

    getAddresses = async (id: string): Promise<AddressDto[]> => {
        return await this._organizationRepo.getAddresses(id);
    };

    addPerson = async (id: string, personId: string): Promise<boolean> => {
        return await this._organizationRepo.addPerson(id, personId);
    };

    removePerson = async (id: string, personId: string): Promise<boolean> => {
        return await this._organizationRepo.removePerson(id, personId);
    };

    getPersons = async (id: string): Promise<PersonDto[]> => {
        return await this._organizationRepo.getPersons(id);
    };

    //#endregion

    //#region Privates

    private updateDto = async (dto: OrganizationDto): Promise<OrganizationDto> => {
        if (dto == null) {
            return null;
        }
        if (dto.ContactUserId != null) {
            var contactUser = await this._userRepo.getById(dto.ContactUserId);
            dto.ContactUser = contactUser;
        }

        if (dto.ParentOrganizationId !== null && dto.ParentOrganization == null) {
            var parentOrganization = await this._organizationRepo.getById(dto.ParentOrganizationId);
            dto.ParentOrganization = parentOrganization;
        }

        var addresses: AddressDto[] = await this._organizationRepo.getAddresses(dto.id);
        dto.Addresses = addresses;

        return dto;
    };

    //#endregion

}

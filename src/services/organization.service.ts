import { AddressDto } from "../domain.types/address/address.dto";
import { inject, injectable } from "tsyringe";
import { IOrganizationRepo } from "../database/repository.interfaces/organization.repo.interface";
import { OrganizationDomainModel } from '../domain.types/organization/organization.domain.model';
import { OrganizationDto } from '../domain.types/organization/organization.dto';
import { OrganizationSearchFilters, OrganizationSearchResults } from '../domain.types/organization/organization.search.types';
import { IUserRepo } from '../database/repository.interfaces/user.repo.interface';
import { IAddressRepo } from '../database/repository.interfaces/address.repo.interface';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class OrganizationService {

    //#region Publics

    constructor(
        @inject('IOrganizationRepo') private _organizationRepo: IOrganizationRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IAddressRepo') private _addressRepo: IAddressRepo,
    ) {}

    create = async (organizationDomainModel: OrganizationDomainModel): Promise<OrganizationDto> => {
        var dto = await this._organizationRepo.create(organizationDomainModel);
        dto = await this.updateDto(dto);
        return dto;
    };

    getById = async (id: string): Promise<OrganizationDto> => {
        var dto = await this._organizationRepo.getById(id);
        dto = await this.updateDto(dto);
        return dto;
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

    getByPersonId = async (personId: string): Promise<OrganizationDto[]> => {
        var dtos = await this._organizationRepo.getByPersonId(personId);
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

    addPerson = async (id: string, personId: string): Promise<boolean> => {
        return await this._organizationRepo.addPerson(id, personId);
    };

    removePerson = async (id: string, personId: string): Promise<boolean> => {
        return await this._organizationRepo.removePerson(id, personId);
    };

    //#endregion

    //#region Privates

    private updateDto = async (dto: OrganizationDto): Promise<OrganizationDto> => {

        if (dto.ContactUserId != null) {
            var contactUser = await this._userRepo.getById(dto.ContactUserId);
            dto.ContactUser = contactUser;
        }

        if (dto.ParentOrganizationId !== null && dto.ParentOrganization == null) {
            var parentOrganization = await this._organizationRepo.getById(dto.ParentOrganizationId);
            dto.ParentOrganization = parentOrganization;
        }

        var addresses: AddressDto[] = await this._addressRepo.getByOrganizationId(dto.id);
        dto.Addresses = addresses;
        
        return dto;
    };

    //#endregion

}

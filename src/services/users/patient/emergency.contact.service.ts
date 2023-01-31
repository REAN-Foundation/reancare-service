import { inject, injectable } from "tsyringe";
import { IAddressRepo } from "../../../database/repository.interfaces/general/address.repo.interface";
import { IOrganizationRepo } from "../../../database/repository.interfaces/general/organization.repo.interface";
import { IEmergencyContactRepo } from "../../../database/repository.interfaces/users/patient/emergency.contact.repo.interface";
import { IPersonRepo } from "../../../database/repository.interfaces/person/person.repo.interface";
import { EmergencyContactDomainModel } from '../../../domain.types/users/patient/emergency.contact/emergency.contact.domain.model';
import { EmergencyContactDto } from '../../../domain.types/users/patient/emergency.contact/emergency.contact.dto';
import { EmergencyContactSearchFilters, EmergencyContactSearchResults } from '../../../domain.types/users/patient/emergency.contact/emergency.contact.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EmergencyContactService {

    constructor(
        @inject('IEmergencyContactRepo') private _contactRepo: IEmergencyContactRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IAddressRepo') private _addressRepo: IAddressRepo,
        @inject('IOrganizationRepo') private _organizationRepo: IOrganizationRepo,
    ) {}

    create = async (contactDomainModel: EmergencyContactDomainModel): Promise<EmergencyContactDto> => {
        var dto = await this._contactRepo.create(contactDomainModel);
        dto = await this.updateDto(dto);
        return dto;
    };

    getById = async (id: string): Promise<EmergencyContactDto> => {
        var dto = await this._contactRepo.getById(id);
        dto = await this.updateDto(dto);
        return dto;
    };

    checkIfContactPersonExists =  async (patientUserId: string, contactPersonId: string)
        : Promise<boolean> => {
        return await this._contactRepo.checkIfContactPersonExists(patientUserId, contactPersonId);
    };

    getContactsCountWithRole =  async (patientUserId: string, contactRole: string)
        : Promise<number> => {
        return await this._contactRepo.getContactsCountWithRole(patientUserId, contactRole);
    };

    search = async (filters: EmergencyContactSearchFilters): Promise<EmergencyContactSearchResults> => {
        var items = [];
        var results = await this._contactRepo.search(filters);
        for await (var dto of results.Items) {
            dto = await this.updateDto(dto);
            items.push(dto);
        }
        results.Items = items;
        return results;
    };

    update = async (id: string, contactDomainModel: EmergencyContactDomainModel): Promise<EmergencyContactDto> => {
        var dto = await this._contactRepo.update(id, contactDomainModel);
        dto = await this.updateDto(dto);
        return dto;
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._contactRepo.delete(id);
    };

    //#region Privates

    private updateDto = async (dto: EmergencyContactDto): Promise<EmergencyContactDto> => {

        if (dto == null) {
            return null;
        }
        if (dto.ContactPersonId != null && dto.ContactPerson == null) {
            var contactPerson = await this._personRepo.getById(dto.ContactPersonId);
            dto.ContactPerson = contactPerson;
        }

        if (dto.OrganizationId !== null && dto.Organization === null) {
            var organization = await this._organizationRepo.getById(dto.OrganizationId);
            dto.Organization = organization;
        }

        if (dto.AddressId !== null && dto.Address === null) {
            var address = await this._addressRepo.getById(dto.AddressId);
            dto.Address = address;
        }

        return dto;
    };

    //#endregion

}
